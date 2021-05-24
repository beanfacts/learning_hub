
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include <IRsend.h>
#include <ir_Panasonic.h>
#include <inttypes.h>
#include <cstddef>

#define AWS_IOT_PUBLISH_TOPIC   "$aws/things/testAc1/shadow/update"
#define AWS_IOT_SUBSCRIBE_TOPIC "$aws/things/testAc1/shadow/update/delta"

int msgReceived = 0;
String rcvdPayload;
const uint16_t IrPin = 4; 
//int temp = 25;
IRsend irsend(IrPin);  
IRPanasonicAc irpanasonic(IrPin);

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(512);

void updateTemp(int target_temp){
  irpanasonic.setTemp(target_temp);
  delay(10);
}


void turnOn(){
  irpanasonic.on();
  Serial.println("turn on end");
  delay(10);
}

void updateFan(int level){
    if (level == 1){
       Serial.println(irpanasonic.toString());
      Serial.println("fan1");
      irpanasonic.setFan(0);
     }
     else if (level == 2) {
      irpanasonic.setFan(2);
     }
     else if (level == 3) {
      irpanasonic.setFan(4);
     }
     else if (level == 0){
      irpanasonic.setFan(7);
     }
    delay(10);
}
void updateSwing(const char* swing_ac){
     if (!strcmp("auto",swing_ac)){
      Serial.println("Auto");
      irpanasonic.setSwingVertical(0xF);
     }
     else if (!strcmp("up",swing_ac)) {
      irpanasonic.setSwingVertical(0x1);
     }
     else if (!strcmp("middle",swing_ac)) {
      irpanasonic.setSwingVertical(0x3);
     }
     else if (!strcmp("down",swing_ac)){
      irpanasonic.setSwingVertical(0x5);
     }
     delay(10);
}
void updateMode(const char*  mode_ac){
      Serial.println("TEST STRCMP");
      Serial.println(strcmp(mode_ac,"cool"));
      if (!strcmp(mode_ac,"auto")){
      Serial.println("Auto");
      irpanasonic.setMode(0);
     }
     else if (!strcmp(mode_ac,"cool")) {
      Serial.println("here");
      irpanasonic.setMode(3);
     }
     else if (!strcmp(mode_ac,"heat")) {
      irpanasonic.setMode(4);
     }
     else if (!strcmp(mode_ac,"dry")){
      irpanasonic.setMode(2);
     }
     else if (!strcmp(mode_ac,"fan")){
      irpanasonic.setMode(6);
     }   
     delay(10);
}
void turnOff(){
  irpanasonic.off();
  delay(10);
  
}

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("");
  Serial.println("###################### Starting Execution ########################");
  Serial.println("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }


  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  client.begin(AWS_IOT_ENDPOINT, 8883, net);


  client.onMessage(messageHandler);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    Serial.println("Trying to connect to AWS IOT");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }


  Serial.println(client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC));

  Serial.println("AWS IoT Connected!");
}

void messageHandler(String &topic, String &payload) {

  char status_str[300];
  irpanasonic.toString().toCharArray(status_str,300);
  Serial.println(status_str);
  Serial.println(topic);
  msgReceived = 1;
  rcvdPayload = payload;
  Serial.println(rcvdPayload);
  Serial.println("incoming: " + topic + " - " + payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(IrPin, OUTPUT);
  connectAWS(); 
  StaticJsonDocument<200> doc;
  char jsonBuffer[200];
  doc["state"]["reported"]["state"] = (char*)0;
  doc["state"]["reported"]["temp"] = (char*)0;
  doc["state"]["reported"]["fan"] = (char*)0;
  doc["state"]["reported"]["swing"] = (char*)0;
  doc["state"]["reported"]["mode"] = (char*)0;
  serializeJson(doc, jsonBuffer);   
  Serial.println("Publish NUll to initialized shadow");
  Serial.println(jsonBuffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC,jsonBuffer);
  Serial.println("##############################################");
}

void loop() {

   if(msgReceived == 1)
    {
        StaticJsonDocument<200> doc;
        char jsonBuffer[200];
        delay(100);
        msgReceived = 0;
        Serial.print("Received Message:");
        Serial.println(rcvdPayload);
        StaticJsonDocument<500> sensor_doc;
        DeserializationError error_sensor = deserializeJson(sensor_doc, rcvdPayload);
        if (error_sensor) {
          Serial.print(F("deserializeJson() failed: "));
           Serial.println(error_sensor.c_str());
           return;
        }
        JsonObject root = sensor_doc["state"].as<JsonObject>();
        char const* mode_ac = (char*)0;
        char const* swing_ac = (char*)0;
        delay(100);
        if (root.containsKey("temp")) {
          int temp_ac = sensor_doc["state"]["temp"];
          updateTemp(temp_ac);
          doc["state"]["reported"]["temp"] = temp_ac;
          Serial.println("temp");
        }
       if (root.containsKey("mode")) {
          mode_ac = sensor_doc["state"]["mode"];
          updateMode(mode_ac);
          doc["state"]["reported"]["mode"] = mode_ac;
          Serial.println("mode");
        }
      if (root.containsKey("swing")) {
          swing_ac = sensor_doc["state"]["swing"];
          updateSwing(swing_ac);
          doc["state"]["reported"]["swing"] = swing_ac;
          Serial.println("swing");
        }
      if (root.containsKey("state")) {
          int state_ac = sensor_doc["state"]["state"];
          Serial.println("state");
          if (state_ac == 1){
            turnOn();
            doc["state"]["reported"]["state"] = 1;
          }
          else if (state_ac == 0){
            turnOff();
            doc["state"]["reported"]["state"] = 0;
          }
        }
      if (root.containsKey("fan")) {
          int fan_ac = sensor_doc["state"]["fan"];
          updateFan(fan_ac);
          doc["state"]["reported"]["fan"] = fan_ac;
          Serial.println("fan");
        }
      irpanasonic.send(2);
      serializeJson(doc, jsonBuffer);   
      Serial.println("Publish report information to shadow");
      Serial.println(jsonBuffer);
      client.publish(AWS_IOT_PUBLISH_TOPIC,jsonBuffer);
      Serial.println(msgReceived);
      Serial.println("##############################################");
    }
  client.loop();
  delay(10);
}
