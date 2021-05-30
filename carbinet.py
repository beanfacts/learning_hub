from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder

import asyncio
import time
import json
import RPi.GPIO as GPIO

loop = asyncio.get_event_loop()

# Message callback
def on_message(topic, payload, **kwargs):
    print(f"Received message from {topic} with payload {payload}")
    data= json.loads(payload)
    if data["state"]["state"] == "unlocked" :
        unlock(channel)
        mqtt_connection.publish(topic="$aws/things/lh_cabinet1/shadow/update", payload=json.dumps(current_unlocked), qos=mqtt.QoS.AT_LEAST_ONCE)
    elif data["state"]["state"] == "locked":
        lock(channel)
        mqtt_connection.publish(topic="$aws/things/lh_cabinet1/shadow/update", payload=json.dumps(current_locked), qos=mqtt.QoS.AT_LEAST_ONCE)    
    
    

###unlocked the carbinet
channel= 4
GPIO.setmode(GPIO.BCM)

def unlock(channel):
    GPIO.setup(channel, GPIO.OUT)
    GPIO.output(channel, GPIO.HIGH)
    
    # Turn motor off
###############
def lock(channel):
    GPIO.setup(channel, GPIO.OUT)
    GPIO.output(channel, GPIO.LOW)
    
   

ENDPOINT = "a3f5m0em621pi8-ats.iot.ap-southeast-1.amazonaws.com"
CLIENT_ID = "lh_cabinet1"

PATH_TO_CERT = "a44224d692-certificate.pem.crt"
PATH_TO_KEY = "a44224d692-private.pem.key"
PATH_TO_ROOT = "amazonroot"

# Spin up resources

event_loop_group = io.EventLoopGroup(1)
host_resolver = io.DefaultHostResolver(event_loop_group)
client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
mqtt_connection = mqtt_connection_builder.mtls_from_path(
    endpoint=ENDPOINT,
    cert_filepath=PATH_TO_CERT,
    pri_key_filepath=PATH_TO_KEY,
    client_bootstrap=client_bootstrap,
    ca_filepath=PATH_TO_ROOT,
    client_id=CLIENT_ID,
    clean_session=False,
    keep_alive_secs=6
)

print("Connecting to {} with client ID '{}'...".format(
        ENDPOINT, CLIENT_ID))

# Make the connect() call
current_locked= {
  "state": {
    "reported": {
      "state": "locked",
    }
  }
}
####################
current_unlocked= {
  "state": {
    "reported": {
      "state": "unlocked",
    }
  }
}


connect_future = mqtt_connection.connect()

# Future.result() waits until a result is available

connect_future.result()
print("Connected!")

subscribe_future, packet_id = mqtt_connection.subscribe(
    topic="$aws/things/lh_cabinet1/shadow/update/delta",
    qos=mqtt.QoS.AT_LEAST_ONCE,
    callback=on_message
)

r = subscribe_future.result()
mqtt_connection.publish(topic="$aws/things/lh_cabinet1/shadow/update", payload=json.dumps(current_locked), qos=mqtt.QoS.AT_LEAST_ONCE)

while True:
    time.sleep(1)