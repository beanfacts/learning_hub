#!/bin/env python3

import json
from typing import Literal
from flask.wrappers import Request
import psycopg2
from psycopg2 import sql
from flask import Flask, request, send_file, Response, jsonify
import logging

app = Flask(__name__)
API_PATH = "/api/v1"
DB_CONF_PATH = "api/server/conf.json"
conf_json = None

# Import config from file
with open(DB_CONF_PATH, "r") as f:
    config = json.loads(f.read())

# Import credentials from configuration file
print("Attempting to import DB credentials")
kv_pairs = " ".join([f"{k}={v}" for k, v in config["db"].items()])

# Attempt a connection to the PostgreSQL database
#print(kv_pairs)
conn = psycopg2.connect(kv_pairs)

with conn.cursor() as cur:
    cur.execute("SELECT current_database(), current_schema();")
    db, sch = cur.fetchone()
    print(f"Writing to {db}.{sch}")

# -----------------------------------------------------------------------------

key = "sdjfui3hfu928932ijor3289j03i2fm0"
def is_authorized(req: Request):
    v = req.headers.get("Authorization")
    return key in v, 1

# -----------------------------------------------------------------------------

"""
Returns all the available buildings.
"""
@app.route(API_PATH + "/buildings")
def get_buildings():
    pass

"""
Returns all the rooms available in a building
"""
@app.route(API_PATH + "/rooms")
def get_rooms():
    with conn.cursor() as cur:
        query = sql.SQL(""" SELECT room_id, room_name from rooms """)
        cur.execute(query)
        data = cur.fetchall()
        output = {"rooms": []}
        for row in data:
            output["rooms"].append(
                {
                    "id": row[0],
                    "name": row[1]
                }
            )
        return jsonify(output), 200


def _get_schedule(uid: int = None, rid: int = None, before: int = 2**63, after: int = 0):
    optarg = []
    if uid is not None: optarg.append(f"uid = {uid}")
    if rid is not None: optarg.append(f"rid = {rid}")
    if before is not None: optarg.append(f"(end_time < {before} OR start_time < {before})")
    if after is not None: optarg.append(f"(start_time > {after} OR end_time > {after})")
    optarg[0] = " WHERE " + optarg[0]
    optarg = " AND ".join(optarg)
    print(optarg)
    with conn.cursor() as cur:
        query = sql.SQL("""
                    SELECT uid, rid, start_time, end_time, first_name, last_name FROM (
                        SELECT
                            u.user_id uid,
                            rooms.room_id rid,
                            r.res_id reservation,
                            room_name,
                            EXTRACT(epoch from start_time) start_time,
                            EXTRACT(epoch from end_time) end_time,
                            first_name,
                            last_name
                        FROM rooms
                        INNER JOIN
                            reservations r on rooms.room_id = r.room_id
                        INNER JOIN
                            users u on r.user_id = u.user_id
                        ORDER BY
                            start_time ASC
                    ) as aaa
                    {filter}
        """.format(filter=optarg))
        print(query)
        cur.execute(query)
        data = cur.fetchall()
        output = dict()
        output["reservations"] = []
        for a in data:
            output["reservations"].append(
                {
                    "id": a[1],
                    "start": a[2],
                    "end": a[3],
                    "name": [a[4], a[5]],
                    "user_id": a[0]
                }
            )
        return output

""" Returns the schedule for a specific room """
@app.route(API_PATH + "/schedule")
def get_schedule():
    res, uid = is_authorized(request)
    if not(res):
        return "no", 401
    x = request.args.to_dict()
    print(x)
    after = 0; before = 2**63 - 1
    if "after" in x:
        after = int(x["after"])
    if "before" in x:
        before = int(x["before"])
    if "room" in x:
        output = _get_schedule(None, x["room"], before, after)
        return jsonify(output), 200
    else:
        return "Missing parameters", 400
    

""" Returns your reservations """
@app.route(API_PATH + "/reservations")
def my_reservations():
    res, uid = is_authorized(request)
    if not(res):
        return "no", 401
    x = request.args.to_dict()
    after = 0; before = 2**63 - 1
    if "after" in x:
        after = int(x["after"])
    if "before" in x:
        before = int(x["before"])
    with conn.cursor() as cur:
        output = _get_schedule(uid, None, before, after)
        return jsonify(output), 200


if __name__ == '__main__':
    app.run()