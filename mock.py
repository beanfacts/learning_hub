#!/bin/env python3

import json
from flask.wrappers import Request
from flask import Flask, request, send_file, Response, jsonify
import logging
import secrets
from http import HTTPStatus

app = Flask(__name__)
API_PATH = "/api/v1"

# Learning Hub Mock API - DynamoDB compatible version

# The Things table will contain the schema as below.
# Typical query will return every thing inside a room
# Primary key = thing id, Sort key = room

"""
    Air Conditioner Sensors:
        
        Key             Value Meaning       Type
        "state"         Power State         Bool
        "temp"          Temperature         Float
        "fan"           Fan speed           0 ~ 3 - 0 is off and 3 is max
        "swing"         Swing state         Bool

    Light Sensors:
        Key             Value Meaning       Value
        "state"         Power State         Bool

    Cabinet Sensors:
        Key             Value Meaning       Value
        "state"         Power State         Bool - if off the cabinet is considered "force locked"
        "open"          Unlocked State      Bool
"""

things = {
    "4384490f": {
        "type": "ac",
        "name": "Room AC",
        "room": "hm_601",
        "sensors": {
            "state": True,
            "temp": 23.0,
            "fan": 3,
            "mode": "cool",
            "swing": True
        } 
    },
    "7d649028": {
        "type": "light",
        "name": "Front Lights",
        "index": 1,
        "room": "hm_601",
        "sensors": {
            "state": False
        }
    },
    "25f3ba91": {
        "type": "light",
        "name": "Rear Lights",
        "index": 2,
        "room": "hm_601",
        "sensors": {
            "state": False
        }
    },
    "da3f7ec2": {
        "type": "cabinet",
        "name": "Equipment",
        "room": "hm_601",
        "sensors": {
            "state": True,
            "open": False
        }
    },
    "dd0879b7": {
        "type": "ac",
        "name": "Room AC",
        "room": "hm_602",
        "sensors": {
            "state": False,
            "temp": None,
            "fan": None,
            "mode": None,
            "swing": None
        } 
    },
    "e88610a5": {
        "type": "light",
        "name": "Room Light",
        "index": 1,
        "room": "hm_602",
        "sensors": {
            "state": False
        }
    },
    "f0086bad": {
        "type": "light",
        "name": "Floor Light",
        "index": 2,
        "room": "hm_602",
        "sensors": {
            "state": True
        }
    },
    "f6841cd2": {
        "type": "light",
        "name": "Table Light",
        "index": 3,
        "room": "hm_602",
        "sensors": {
            "state": True
        }
    }
}

rooms = {
    "hm_601": {
        "name": "HM 601",
    },
    "hm_602": {
        "name": "HM 602",
    },
    "hm_603": {
        "name": "HM 603",
    }
}

users = {
    "admin": {
        "password": "spacebar",
        "role": "admin"
    }
}

sessions = {
    "c90da1db34f11bb52594a89610cd2ffa": "admin"
}

# Login to the system
#   POST /login?username=username&password=password
#   Returns an authentication token
@app.route(API_PATH + "/login", methods=['POST'])
def login_system():
    if request.method == "POST":
        u = request.args.get("username")
        p = request.args.get("password")
        if u in users:
            if users[u]["password"] == p:
                token = secrets.token_hex(16)
                sessions[token] = u
                return token, HTTPStatus.OK
        else:
            return "Unauthorized", HTTPStatus.UNAUTHORIZED
    else:
        return "Bad request type", HTTPStatus.BAD_REQUEST

# To use
#   GET /rooms                              for all rooms
@app.route(API_PATH + "/rooms")
def get_rooms():
    response = jsonify(rooms)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200

   

# To use:
#   GET /things?id=thing_id                 for a specific thing, getting its sensor details
#   GET /things?room_id=room_id             for a specific room, such as hm_601, hm_602, etc.
#   GET /things?type=type                   for a specific type, such as ac, light, etc.
#   GET /things?room_id=room_id&type=type   for a specific type in a room, such as all lights in hm_601
@app.route(API_PATH + "/things")
def get_sensors():
    output = dict()
    thing_id = request.args.get("id")
    room_id = request.args.get("room_id")
    sensor_type = request.args.get("type")
    for (k, v) in things.items():
        if (thing_id is not None and k != thing_id):
            continue
        if (sensor_type is not None and v["type"] != sensor_type):
            continue
        if (room_id is not None and v["room"] != room_id):
            continue
        output[k] = v
#    return jsonify({"result": output}), HTTPStatus.OK
    response = jsonify({"result": output})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, HTTPStatus.OK

# To use:
#   POST /control?id=id -> with the body containing the request data
#   For example: {"state": False, "temp": 23.0}, for an air conditioner.
#   MQTT devices which need updating will be updated automatically.
#   The state can be confirmed again by querying the /things endpoint.
@app.route(API_PATH + "/control", methods=['POST'])
def sensor_control():
    if (request.content_type == 'application/json' and request.method == 'POST'):  
        for (k, v) in dict(request.json).items():  
            thing_id = request.args.get("id")
            print(f"Thing {thing_id}")
            if thing_id in things:
                if k in things[thing_id]["sensors"]:
                    ktype = type(things[thing_id]["sensors"][k])
                    intype = type(v)
                    if ktype == intype:
                        things[thing_id]["sensors"][k] = v
                        print(f"Updated {k} -> {v} for sensor {thing_id}")
                    print("error")
        #return "Updated", 200
        response = "Updated"
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    else:
        #return "Bad request type", HTTPStatus.BAD_REQUEST
        response = "Bad request type"
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, HTTPStatus.BAD_REQUEST


if __name__ == '__main__':
    app.run()
