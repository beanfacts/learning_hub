"""
SPDX-License-Identifer: MIT
Learning Hub Backend - Main Lambda Function
Copyright (C) 2021 Tim Dettmar

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
"""

import re
import json
import decimal
import base64
import secrets
from http import HTTPStatus
from functools import reduce
from operator import and_

from boto3.dynamodb.conditions import Key, Attr, And, Or, Not
import boto3
import botocore

# Debugging; redirect stdout to buffer
from io import StringIO
from contextlib import redirect_stdout

buf = StringIO()
# API base path
BASE_PATH = "/api/v1/"

def log(msg, end="\n"):
    buf.write(str(msg) + end)

# Source: https://www.reddit.com/r/aws/comments/bwvio8/dynamodb_has_been_storing_integers_as/
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)


# Convert an error message to json
def err_json(event, context, statusCode, msg):
    return {
        "statusCode": statusCode,
        'headers': {"content-type": "application/json"},
        "body": json.dumps({
            "status": "failure", 
            "reason": msg,
            "debug_info": {
                "event": event,
                "rem_time": context.get_remaining_time_in_millis(),
                "stdout": buf.getvalue()
            }})
    }


# Return JSON response with debugging information
def resp_json(event, context, result, **kwargs):
    
    statusCode = kwargs.get("statusCode", 200)
    
    return {
        'statusCode': statusCode,
        "status": "success",
        'headers': {
            "content-type": "application/json",
            "Cache-Control": "no-cache"
        },
        'body': json.dumps({
            "result": result,
            "debug_info": {
                "event": event,
                "rem_time": context.get_remaining_time_in_millis(),
                "stdout": buf.getvalue()
            }
        }, cls=DecimalEncoder)
    }


# Return CORS preflight response
def get_preflight():
    return {
        'statusCode': 200,
        'status': 'success',
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        }
    }

# Get the API endpoint location, without URL, base path, and parameters.
def get_api_endpoint(event):
    if "rawPath" in event:
        return event["rawPath"].replace(BASE_PATH, "")
    return None


# Function that performs check if user is authorized
def get_auth_detail(token):
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('lh_users')
    data = token.split(":")
    
    # If not 2, the token is malformed
    if len(data) == 2:
        response = table.get_item(
            Key={
                "username": data[0]
            },
            AttributesToGet=[
                'sessions',
                'user_type'
            ]
        )
        for sess in response["Item"]["sessions"]:
            if sess == token:
                return (data[0], response["Item"]["user_type"])
        
    # Invalid session token
    return None


# Check DynamoDB response was successful
def check_ddb_ok(response):
    if response is None or response["ResponseMetadata"]["HTTPStatusCode"] != 200:
        return False
    return True


# Main function
def lambda_handler(event, context):
    
    try:
        
        # Pass Lambda test
        if "requestContext" not in event:
            return "hello lambda"
        
        # Check the user's request method
        req_method = event["requestContext"]["http"]["method"]
        req_ip = event["requestContext"]["http"]["method"]
        
        if req_method == 'OPTIONS':
            return get_preflight()
        
        # Determine API endpoint
        endpoint = get_api_endpoint(event)
        if endpoint in (None, ""):
            return err_json(event, context, HTTPStatus.BAD_REQUEST, "No endpoint.")
        
        # Check if the request has any parameters
        has_params = False
        if "queryStringParameters" in event:
            parameters = event['queryStringParameters']
            if (parameters != None):
                has_params = True
        
        # Check if the user is authorized or not as well as the user type
        logged_in = False
        if "sessid" in event["headers"]:
            user_type = get_auth_detail(event["headers"]["sessid"])
            if user_type is None:
                return err_json(event, context, HTTPStatus.BAD_REQUEST, "User or token invalid.")
                
        
# ------------------------- Unauthorized endpoints ----------------------------
        
        # Sign up - first stage
        elif endpoint == "signup" and req_method == "POST":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            
            # Allowed registration emails for verification.
            VERIFY_REGEX = {
                "student": r"[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]@kmitl\.ac\.th",
                "staff_lecturer": r"[a-z]*\.[a-z]*@kmitl\.ac\.th"
            }
            
            req_params = {
                "username", "password", "first_name", "last_name", "email"
            }
            
            # Check the user included a JSON payload
            if "body" not in event:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Request body is empty.")
            
            # Transform request
            if type(event["body"]) != dict:
                log("Transforming request body to dict...")
                j_state = json.loads(event["body"])
            else:
                log("Using event body as-is...")
                j_state = json.loads(event["body"])
                
            if "email" in j_state:
                j_state["email"] = j_state["email"].lower()
                
            if len(req_params.intersection(set(j_state))) != len(req_params):
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                f"Invalid data in request body, {r}, {j_state}")
            
            m = None
            for (k, v) in VERIFY_REGEX.items():
                m = re.match(v, j_state["email"])
                if m is not None: break
            
            if m is not None:
                
                utype = k
                uemail = j_state["email"]
                
                # Check this email isn't in limbo
                response = table.get_item(
                    Key={
                        "username": "_limbo"
                    }
                )
                
                if not check_ddb_ok(response):
                    return err_json(event, context, 500, "Database error.")
                
                if j_state["username"] in response['Item']['pending_users']:
                    return err_json(event, context, 403, "User is pending email verification.")
                
                # Check this email or username doesn't exist in the database yet
                response = table.scan(
                    FilterExpression=\
                        Or(
                            Key("user_id").eq(j_state["username"]),
                            Attr("email").eq(j_state["email"])
                        )
                )
                
                vcode = 123456
                
                # If it doesn't exist then create an entry in pending limbo
                if not check_ddb_ok(response):
                    return err_json(event, context, 500, "Database error.")
                    
                if len(response['Items']) == 0:
                    
                    response = table.update_item(
                        Key={
                            "username": "_limbo"
                        },
                        UpdateExpression = "SET pending_users.#a = :map",
                        ExpressionAttributeNames = { "#a" : j_state["username"] },
                        ExpressionAttributeValues = { ":map" : {
                            "username": j_state["username"], "password": j_state["password"],
                            "verif_code": vcode, "first_name": j_state["first_name"],
                            "last_name": j_state["last_name"], "user_type": utype,
                            "email": j_state["email"]
                        }}
                    )
                    
                    if not check_ddb_ok(response):
                        return err_json(event, context, 500, "Database error.")
                    else:
                        return resp_json(event, context, {"msg": "User must verify email address to continue."})
                
                else:
                    return err_json(event, context, 403, "Username or email already exists.")
                    
            else:
                return err_json(event, context, 400, "Email is invalid.")
        
        # Verify email - second stage
        elif endpoint == "signup_verify" and req_method == "POST":
            if not has_params or len({"username", "verif_code"}.intersection(parameters)) != 2:
                return err_json(event, context, 400, "Incorrect parameters.")
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            # Check this email isn't in limbo
            response = table.get_item(
                Key={
                    "username": "_limbo"
                }
            )
            if not check_ddb_ok(response):
                return err_json(event, context, 500, "Database error.")
            if parameters["username"] in response["Item"]["pending_users"]:
                if parameters["verif_code"] == str(response["Item"]["pending_users"][parameters["username"]]["verif_code"]):
                    # Add the user
                    del response["Item"]["pending_users"][parameters["username"]]["verif_code"]
                    response["Item"]["pending_users"][parameters["username"]]["sessions"] = []
                    response = table.put_item(
                        Item= response["Item"]["pending_users"][parameters["username"]]
                    )
                    if not check_ddb_ok(response):
                        return err_json(event, context, 500, "Database error.")
                    response = table.update_item(
                        Key={
                            "username": "_limbo"
                        },
                        UpdateExpression=f"REMOVE pending_users.#x",
                        ExpressionAttributeNames={"#x": parameters["username"]}
                    )
                    if not check_ddb_ok(response):
                        return err_json(event, context, 500, "Database error.")
                    return resp_json(event, context, {"msg": "User registration successful"})
                return resp_json(event, context, {"msg": "Verification token invalid"}, statusCode=HTTPStatus.FORBIDDEN)
            return resp_json(event, context, {"msg": "Username invalid"}, statusCode=HTTPStatus.FORBIDDEN)
        
        # If not authorized, the only possible endpoint is the login endpoint
        elif endpoint == "login":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            if has_params and len({"username", "password"}.intersection(parameters)) == 2:
                
                # Search the table for the user
                response = table.get_item(
                    Key={
                        "username": parameters["username"],
                    }
                )
                
                if response is None \
                        or 'Item' not in response \
                        or response["ResponseMetadata"]["HTTPStatusCode"] != 200:
                    return err_json(event, context, HTTPStatus.UNAUTHORIZED,
                        "Username not found.")
                
                # No login users (course names, can only use static tokens)
                if "nologin" in response["Item"]["user_type"]:
                    return err_json(event, context, HTTPStatus.UNAUTHORIZED,
                    "Your user type does not allow GUI logins.")
                
                # Generate a new token for normal users
                if parameters["password"] == response["Item"]["password"]:
                    sessid = f"{parameters['username']}:{secrets.token_hex(16)}"
                    
                    response = table.update_item(
                        Key={
                            "username": parameters["username"]
                        },
                        UpdateExpression="SET sessions = list_append(sessions, :i)",
                        ExpressionAttributeValues={
                            ":i": [sessid]
                        },
                        ReturnValues="UPDATED_NEW")
                        
                    if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
                        return resp_json(event, context, {"token": sessid})
                    return err_json(event, context, 500, 
                        "Failed to update database.")
                        
                else:
                    return err_json(event, context, HTTPStatus.UNAUTHORIZED,
                    "Password is invalid.")
        
        # Otherwise the user is forbidden from further access
        else:
            return err_json(event, context, HTTPStatus.UNAUTHORIZED, 
                "Please log in before accessing the system.")
        
# --------------------------- Authorized section ------------------------------
        
        # Get things in a specific room
        if endpoint == "things":
            
            # Connect to IoT Core + IoT Data Plane
            client = boto3.client('iot')
            client_plane = boto3.client('iot-data')
            things_full = client.list_things()
            
            respData = list()
            
            # Build up filter criteria
            avail_criteria = {"thing_id", "room_id", "type"}
            f_criteria = dict()
            if has_params:
                for i in avail_criteria:
                    if i in parameters:
                        f_criteria[i] = parameters[i]
            
            # Reduce number of features in things list
            if things_full is not None:
            
                things = dict()
                for t in things_full["things"]:
                    
                    if "thingTypeName" not in t:
                        t["thingTypeName"] = None
                    
                    if "thing_id" in f_criteria \
                            and t["thingName"] != f_criteria["thing_id"]:
                        continue
                    
                    if "room_id" in f_criteria:
                        if ("room_id" in t["attributes"] and f_criteria["room_id"] != t["attributes"]["room_id"]):
                            continue
                        if ("room_id" not in t["attributes"]):
                            continue
                    
                    if "type" in f_criteria \
                            and f_criteria["type"] != t["thingTypeName"]:
                        continue
                        
                    things[t["thingName"]] = {
                        "type": t["thingTypeName"],
                        "attributes": t["attributes"]
                    }
                    
                log("Got things")
                
                for (k, v) in things.items():
                    try:
                        # Get sensors shadow for each thing
                        response = client_plane.get_thing_shadow(
                            thingName=k
                        )
                        
                        # Read the thing shadow
                        tmp = json.loads(response["payload"].read(amt=None))
                        if "state" in tmp:
                            things[k]["sensors"] = tmp["state"]
                        else:
                            t["sensors"] = None
                    
                    # For sensors that do not have shadows, ignore them and skip
                    except client_plane.exceptions.ResourceNotFoundException as e:
                        pass
            
            # If no things were detected, return an error.
            if things is None:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Error getting things from IoT Core.")
            
            return resp_json(event, context, {"things": things})
        
        # Get user list
        elif endpoint == "users" and req_method == "GET":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            
            response = table.scan(
                ProjectionExpression="username, first_name, last_name, user_type"
            )
            
            if check_ddb_ok(response):
                return resp_json(event, context, response['Items'])
        
        # Get schedules based on filter criteria
        elif endpoint == "schedule" and req_method == "GET":
            
            if not has_params:
                return err_json(event, context, 400, "Endpoint requires parameters.")
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_schedule')
            
            r = {"room_id", "start_time", "end_time"}.intersection(parameters)
    
            if len(r) == 3:
                
                response = table.scan(FilterExpression=\
                    And(
                        Or(
                            And(
                                Key("start_time").gte(int(parameters["start_time"])),
                                Key("start_time").lte(int(parameters["end_time"]))
                            ),
                            And(
                                Key("end_time").gte(int(parameters["start_time"])),
                                Key("end_time").lte(int(parameters["end_time"]))
                            )
                        ),
                        Key("room_id").eq(parameters["room_id"])
                    )
                )
                
                if check_ddb_ok(response):
                    items = response['Items']
                    return resp_json(event, context, items)
                else:
                    return err_json(event, context, 500, "Database error.")
                
            else:
                return err_json(event, context, HTTPStatus.BAD_REQUEST, 
                    f"Expected 3 values, got {len(r)} -> {r}")
        
        # Create a scheduled event
        elif endpoint == "schedule" and req_method == "POST":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_schedule')
            
            r = {"room_id", "start_time", "end_time"}
            
            # Check the user included a JSON payload
            if "body" not in event:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Request body is empty.")
            
            # Transform request
            if type(event["body"]) != dict:
                log("Transforming request body to dict...")
                j_state = json.loads(event["body"])
            else:
                log("Using event body as-is...")
                j_state = json.loads(event["body"])
                
            if len(r.intersection(set(j_state))) != len(r):
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                f"Invalid data in request body, {r}, {j_state}")
            
            # Search for conflicting schedules
            response = table.scan(FilterExpression=\
                And(
                    Or(
                        And(
                            Key("start_time").gte(int(j_state["start_time"])),
                            Key("start_time").lt(int(j_state["end_time"]))
                        ),
                        And(
                            Key("end_time").gt(int(j_state["start_time"])),
                            Key("end_time").lte(int(j_state["end_time"]))
                        )
                    ),
                    Key("room_id").eq(j_state["room_id"])
                )
            )
            
            if "course_id" not in j_state:
                j_state["course_id"] = "Unassigned"
                
            if "description" not in j_state:
                j_state["description"] = "No description provided."
                
            if "title" not in j_state:
                j_state["title"] = "No title"
            
            if check_ddb_ok(response):
                if len(response['Items']):
                    return resp_json(event, context, 
                        {
                            "msg": "There are conflicting scheduled events.",
                            "events": response['Items']
                        },
                        statusCode=HTTPStatus.CONFLICT)
                else:
                    
                    res_id = secrets.token_urlsafe(8)
                    
                    response = table.put_item(
                        Item={
                            "title": j_state["title"],
                            "room_id": j_state["room_id"],
                            "reservation_id": res_id,
                            "start_time": j_state["start_time"],
                            "end_time": j_state["end_time"],
                            "actions": [],
                            "course_id": j_state["course_id"],
                            "description": j_state["description"],
                            "username": user_type[0]
                        },
                        ReturnValues="ALL_OLD"
                    )
                    
                    if not check_ddb_ok(response):
                        return err_json(event, context, 500,
                            "Could not update the database.")
                    return resp_json(event, context, {"msg": "OK", "reservation_id": res_id})
            else:
                return err_json(event, context, 500, "Database error.")
                    
        # Update an existing scheduled event
        elif endpoint == "schedule" and req_method == "PATCH":
        
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_schedule')
            iot_data = boto3.client('iot-data')
            
            r = {"room_id", "start_time", "end_time", "reservation_id"}
            
            # Check the user included a JSON payload
            if "body" not in event:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Request body is empty.")
            
            # Transform request
            if type(event["body"]) != dict:
                log("Transforming request body to dict...")
                j_state = json.loads(event["body"])
            else:
                log("Using event body as-is...")
                j_state = json.loads(event["body"])
                
            if len(r.intersection(set(j_state))) != len(r):
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                f"Invalid data in request body, {r}, {j_state}")
            
            # Search for conflicting schedules, excluding the one we actually
            # want to modify.
            response = table.scan(FilterExpression=\
                And(
                    And(
                        Or(
                            And(
                                Key("start_time").lte(int(j_state["start_time"])),
                                Key("end_time").gte(int(j_state["start_time"]))
                            ),
                            And(
                                Key("start_time").lte(int(j_state["end_time"])),
                                Key("end_time").gte(int(j_state["end_time"]))
                            )
                        ),
                        Key("room_id").eq(j_state["room_id"])
                    ),
                    Not(
                        And(
                            Key("room_id").eq(j_state["room_id"]),
                            Key("reservation_id").eq(j_state["reservation_id"])
                        )
                    )
                )
            )
            
            j_state["username"] = user_type[0]
            
            if "course_id" not in j_state:
                j_state["course_id"] = "Unassigned"
                
            if "description" not in j_state:
                j_state["description"] = "No description provided."
                
            if "title" not in j_state:
                j_state["title"] = "No title"
                
            noAct = False
            if "actions" not in j_state:
                j_state["actions"] = []
                noAct = True
            
            if check_ddb_ok(response):
                
                # Conflicting event check
                if len(response['Items']):
                    return resp_json(event, context, 
                        {
                            "msg": "There are conflicting scheduled events.",
                            "events": response['Items']
                        },
                        statusCode=HTTPStatus.CONFLICT
                    )
                
                # Perform scheduled action updates
                else:
                    
                    # See if there are any existing actions
                    response = table.get_item(
                        Key={
                            "room_id": j_state["room_id"],
                            "reservation_id": j_state["reservation_id"]
                        },
                        ProjectionExpression="actions"
                    )
                    
                    if not check_ddb_ok(response):
                        return err_json(event, context, 500, "Error while getting actions.")
                    
                    # Stop the existing action states
                    if len(response['Item']['actions']):
                        for itm in response['Item']['actions']:
                            pub_response = iot_data.publish(
                                topic="actions/update",
                                qos=1,
                                payload=json.dumps({
                                    "room_id": j_state["room_id"],
                                    "action_id": itm["action_id"],
                                    "cancel": True
                                }, cls=DecimalEncoder)
                            )
                    
                    if noAct:
                        j_state["actions"] = response['Item']['actions']
                    
                    # Determine if there are new actions to be performed
                    if len(j_state["actions"]) != 0:
                        
                        # Create new actions
                        for itm in j_state["actions"]:
                            
                            itm["action_id"] = secrets.token_hex(8)
                            pub_response = iot_data.publish(
                                topic="actions/update",
                                qos=1,
                                payload=json.dumps({
                                    "room_id": j_state["room_id"],
                                    "action_id": itm["action_id"],
                                    "time": j_state["start_time"] + itm["delta"],
                                    "thing_id": itm["thing_id"],
                                    "action": itm["action"],
                                }, cls=DecimalEncoder)
                            )
                        
                
                try:
                
                    response = table.update_item(
                        Key={
                            "room_id": j_state["room_id"],
                            "reservation_id": j_state["reservation_id"]
                        },
                        UpdateExpression="SET start_time=:st, end_time=:et, actions=:a, course_id=:cid, description=:description, title=:tt",
                        ExpressionAttributeValues={
                            ":tt": j_state["title"],
                            ":st": j_state["start_time"],
                            ":et": j_state["end_time"],
                            ":a": j_state["actions"],
                            ":cid": j_state["course_id"],
                            ":description": j_state["description"]
                        },
                        ConditionExpression=Attr("username").eq(user_type[0]),
                        ReturnValues="ALL_NEW" 
                    )
                    
                except botocore.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                        return err_json(event, context, HTTPStatus.BAD_REQUEST,
                            "You do not have permission to modify this event.")
                        
                if not check_ddb_ok(response):
                    return err_json(event, context, 500,
                        "Could not update the database.")
                return resp_json(event, context, {"current": response["Attributes"]})
            else:
                return err_json(event, context, 500, "Database error.")
        
        # Delete a scheduled event using URL parameters
        elif endpoint == "schedule" and req_method == "DELETE":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_schedule')
            iot_data = boto3.client('iot-data')
            
            r = {"room_id", "reservation_id"}.intersection(parameters)
                
            if len(r) != 2:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                f"Missing parameters in request.")
            
            try:
                response = table.delete_item(
                    Key={
                        "room_id": parameters["room_id"],
                        "reservation_id": parameters["reservation_id"]
                    },
                    ConditionExpression=Attr("username").eq(user_type[0]),
                    ReturnValues='ALL_OLD'
                )
                
                if not check_ddb_ok(response):
                    return err_json(event, context, 500, "Database error.")
                
                if "actions" in response['Attributes'] and len(response['Attributes']['actions']):
                    for itm in response['Attributes']:
                        # since we deleted the course we want to delete the actions too
                        if len(response['Attributes']['actions']):
                            for itm in response['Attributes']['actions']:
                                pub_response = iot_data.publish(
                                    topic="actions/update",
                                    qos=1,
                                    payload=json.dumps({
                                        "room_id": response['Attributes']["room_id"],
                                        "action_id": itm["action_id"],
                                        "cancel": True
                                    }, cls=DecimalEncoder)
                                )
                    
            
            # User not authorized or already deleted this entry
            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                    return err_json(event, context, HTTPStatus.BAD_REQUEST,
                        "The event has already been deleted, or you do not have permission to delete it.")
                else:
                    return err_json(event, context, HTTPStatus.BAD_REQUEST,
                        f"An unknown error ({e.response['Error']['Code']}) occurred while trying to delete the event.")
            
            if check_ddb_ok(response):
                if len(response['Attributes']):
                   return resp_json(event, context, {"deleted": response["Attributes"]})
                else:
                    return err_json(event, context, HTTPStatus.GONE, "Item does not exist.")
            else:
                return err_json(event, context, 500, "Database error.")

        # Get a list of all courses
        elif endpoint == "courses":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            
            log(f'{Key("user_type").eq("nologin_course")}')
            
            response = table.scan(
                FilterExpression=Key("user_type").eq("nologin_course"),
                ProjectionExpression="username, first_name, last_name"
            )
            
            items = response['Items']
            return resp_json(event, context, items)
            
        # Get a list of all rooms
        elif endpoint == "rooms":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_rooms')
            response = table.scan()
            
            if not check_ddb_ok(response):
                return err_json(event, context, 500,
                    "Could not fetch rooms from database.")
            
            return resp_json(event, context, response['Items'])
        
        # Control IoT devices by changing their desired states
        elif endpoint == "control":
            
            if not has_params:
                return err_json(event, context, 400, "Endpoint requires parameters.")
            
            # Connect to IoT Core + IoT Data Plane
            client_plane = boto3.client('iot-data')
            
            # Check the user passed in the correct parameters
            if "thing_id" not in parameters:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Must specify thing_id")
            
            # Check the user included a JSON payload
            if "body" not in event:
                return err_json(event, context, HTTPStatus.BAD_REQUEST,
                    "Request body is empty.")
            
            # Transform request
            if type(event["body"]) != dict:
                log("Transforming request body to dict...")
                j_state = json.loads(event["body"])
            else:
                log("Using event body as-is...")
                j_state = json.loads(event["body"])
            
            # Check the thing actually exists
            tmp = None
            try:
                # Get the current sensor shadow
                response = client_plane.get_thing_shadow(
                    thingName=parameters["thing_id"]
                )
                if response is not None:
                    tmp = json.loads(response["payload"].read(amt=None))
                else:
                    return err_json(event, context, HTTPStatus.GONE,
                    "Error finding the specified thing.")
            except client_plane.exceptions.ResourceNotFoundException as e:
                return err_json(event, context, HTTPStatus.GONE,
                    "The specified thing does not exist. It may have been deleted.")
            
            keys = set(tmp["state"]["reported"]).intersection(set(j_state))
            out_state = dict()
            
            reported = tmp["state"]["reported"]
            
            for k in keys:
                out_state[k] = j_state[k]
            
            log(f"Output state=<{out_state}>")
    
            response = client_plane.update_thing_shadow(
                thingName=parameters["thing_id"],
                payload=json.dumps({"state": {"desired": out_state}})
            )
            
            if response is not None:
                tmp = json.loads(response["payload"].read(amt=None))
                log(f"tmp=<{tmp}")
                for (k, v) in tmp["state"]["desired"].items():
                    if out_state[k] != v:
                        return err_json(event, context, 500, 
                            "Update of IoT device status failed.")
            
            if len(out_state):
                out_msg = "Updated IoT device data."
                scode = 200
            else:
                out_msg = "Did not perform IoT device updates."
                scode = HTTPStatus.BAD_REQUEST
            
            return resp_json(event, context, {
                "msg": out_msg,
                "reported_keys": list(reported),
                "desired_keys": list(tmp["state"]["desired"]),
                "request_keys": list(j_state),
                "updated_keys": list(out_state),
                "update_summary": tmp["state"]
            }, statusCode=scode)
        
        # Log out, removing only the current session token
        elif endpoint == "logout":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            
            log("Logging out user.")
            
            # Push the updated list of valid session tokens into the
            # database. RACE CONDITION: fix by making transactional
            response = table.get_item(
                Key={
                    "username": user_type[0],
                },
                ProjectionExpression="sessions"
            )
            
            # Remove the current session token, by far not the most
            # efficient way to do this
            
            if not check_ddb_ok(response):
                return err_json(event, context, 500, "Database error.")
            
            itm = []
            for i in response['Item']["sessions"]:
                if i != event["headers"]["sessid"]:
                    itm.append(i)

            # Push the updated list of valid session tokens into the
            # database. Strongly consistent write
            response = table.update_item(
                Key={
                    "username": user_type[0]
                },
                UpdateExpression="SET sessions = :i",
                ExpressionAttributeValues={
                    ":i": itm
                },
                ReturnValues="UPDATED_NEW"
            )
            
            if not check_ddb_ok(response):
                return err_json(event, context, 500, "Database error.")
            
            for i in response['Attributes']['sessions']:
                if i == event["headers"]["sessid"]:
                    return err_json(event, context, 500, "Database delete fail.")
            
            return resp_json(event, context, {"msg": "Logged out."})
            
        # Purge all session tokens for the user
        elif endpoint == "purge_sessions":
            
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('lh_users')
            log(f"Invalidating all session tokens for {user_type[0]}")
            itm = []

            # Push the updated list of valid session tokens into the
            # database. Strongly consistent write
            response = table.update_item(
                Key={
                    "username": user_type[0]
                },
                UpdateExpression="SET sessions = :i",
                ExpressionAttributeValues={
                    ":i": itm
                },
                ReturnValues="UPDATED_NEW"
            )
            
            if not check_ddb_ok(response):
                return err_json(event, context, 500, "Database error.")
            
            for i in response['Attributes']['sessions']:
                if i == event["headers"]["sessid"]:
                    return err_json(event, context, 500, "Database delete fail.")
            
            return resp_json(event, context, {"msg": "Logged out."})
        
        else:
            return err_json(event, context, 400, "Invalid endpoint or request method.")
            
    except Exception as e:
        import traceback
        return err_json(event, context, 500, {"msg": str(e), "stack": traceback.format_exc()})