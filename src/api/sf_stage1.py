"""
SPDX-License-Identifer: MIT
Learning Hub Backend - Step Functions Stage 1
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

REGION = "ap-southeast-1"
ACCOUNT_ID = "123456789"
STM_NAME = "lh_schedact_sf"

import re
import json
import time
import decimal
import base64
import secrets
import traceback
from http import HTTPStatus
from functools import reduce
from operator import and_

from datetime import datetime



from boto3.dynamodb.conditions import Key, Attr, And, Or, Not
import boto3
import botocore

# Check DynamoDB response was successful
def check_ddb_ok(response):
    if response is None or response["ResponseMetadata"]["HTTPStatusCode"] != 200:
        return False
    return True

def lambda_handler(event, context):
    
    try:
        
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('lh_actions')
        client = boto3.client('iot-data')
        sf = boto3.client('stepfunctions')
        
        if "time" in event:
            ut = datetime.utcfromtimestamp(event["time"]).strftime('%Y-%m-%dT%H:%M:%SZ').replace(" ", "T")
        
        if "checkonly" in event:

            ut = datetime.utcfromtimestamp(time.time() + 20).strftime('%Y-%m-%dT%H:%M:%SZ').replace(" ", "T")
            
            pub_response = client.publish(
                    topic="debug/sf",
                    qos=0,
                    payload=json.dumps({"function": "sf1", "state": "checking permission", "ut": ut})
            )
            
            response = table.scan()
            
            exc_response = sf.start_execution(
                stateMachineArn=f'arn:aws:states:{REGION}:{ACCOUNT_ID}:stateMachine:{STM_NAME}',
                name=f"testsf_{secrets.token_hex(8)}",
                input=json.dumps({"time": ut})
            )
            
            pub_response = client.publish(
                    topic="debug/sf",
                    qos=0,
                    payload=json.dumps({"function": "sf1", "state": "started"})
            )
            
            return "done"
        
        if "cancel" in event and event["cancel"]:
            
            try:
                
                response = table.delete_item(
                    Key={
                        "room_id": event["room_id"],
                        "action_id": event["action_id"]
                    }
                )
                
            except botocore.exceptions.ClientError as e:
            
                pub_response = client.publish(
                    topic="debug/sf",
                    qos=1,
                    payload=json.dumps({"error": traceback.format_exc()})
                )
            
            pub_response = client.publish(
                topic="debug/sf",
                qos=0,
                payload=json.dumps({"function": "sf1", "state": "deleted item"})
            )
            
            exc_response = sf.stop_execution(
                executionArn=f"arn:aws:states:{REGION}:{ACCOUNT_ID}:stateMachine:{STM_NAME}:{event['action_id']}"
            )
        
        reqd = {"room_id", "action_id", "time", "thing_id", "action"}
        
        if len(reqd.intersection(event)) != len(reqd):
            return {'statusCode': 400, 'body': 'Invalid Request'}
        
        pval = {
            "room_id": event["room_id"],
            "action_id": event["action_id"],
            "time": ut,
            "thing_id": event["thing_id"],
            "action": event["action"]
        }
        
        try:
            
            response = table.put_item(
                Item={
                    "room_id": event["room_id"],
                    "action_id": event["action_id"],
                    "time": event["time"],
                    "thing_id": event["thing_id"],
                    "action": event["action"],
                    "executed": False
                }
            )
            
            if not check_ddb_ok(response):
                return {'statusCode': 500, 'body': 'Database error'}
            
        except botocore.exceptions.ClientError as e:
            
            pub_response = client.publish(
                topic="debug/sf",
                qos=1,
                payload=json.dumps({"error": traceback.format_exc()})
            )
            
            return {'statusCode': 500, 'body': e.response['Error']['Code']}
        
        exc_response = sf.start_execution(
            stateMachineArn=f'arn:aws:states:{REGION}:{ACCOUNT_ID}:stateMachine:{STM_NAME}',
            name=f"{pval['action_id']}",
            input=json.dumps(pval)
        )
    
        pub_response = client.publish(
            topic="debug/sf",
            qos=0,
            payload=json.dumps({"function": "sf1", "val": pval})
        )
            
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda!')
        }
        
    except Exception as e:
        
        client = boto3.client('iot-data')
        pub_response = client.publish(
                topic="debug/sf",
                qos=1,
                payload=json.dumps({"error": traceback.format_exc()})
        )