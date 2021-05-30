"""
SPDX-License-Identifer: MIT
Learning Hub Backend - Step Functions Stage 2
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
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('lh_actions')
    client = boto3.client('iot-data')

    pub_response = client.publish(
            topic="debug/sf",
            qos=0,
            payload=json.dumps({"function": "sf2", "event": event})
    )
    
    if "Input" in event:
        inval = event["Input"]
    else:
        inval = event["input"]
    
    try:
        
        response = table.get_item(
            Key={
                "room_id": inval["room_id"],
                "action_id": inval["action_id"]
            }
        )
        
        if not check_ddb_ok(response):
            return {'statusCode': 400, 'body': 'Invalid Request or item deleted (scheduled action cancelled)'}
        
        ri = response['Item']
        
        pub_response = client.publish(
            topic=f"$aws/things/{ri['thing_id']}/shadow/update",
            qos=1,
            payload=json.dumps({"state": {"desired": inval["action"]}})
        )
        
        response = table.update_item(
            Key={
                "room_id": inval["room_id"],
                "action_id": inval["action_id"]
            },
            UpdateExpression="SET executed=:x",
            ExpressionAttributeValues={
                ":x": True
            },
            ReturnValues="ALL_NEW"
        )
        
        if not check_ddb_ok(response):
            return {'statusCode': 400, 'body': 'Performed the action but DynamoDB could not be updated!'}
            
        if "Item" in response:
            return {'statusCode': 200, 'body': 'Performed the action!'}
    
    except botocore.exceptions.ClientError as e:
            
        pub_response = client.publish(
            topic="debug/sf",
            qos=1,
            payload=json.dumps({"error": traceback.format_exc()})
        )
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }