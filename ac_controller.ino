
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <IRsend.h>
#include <ir_Gree.h>
#include <inttypes.h>
// Replace the next variables with your SSID/Password combination
const char* ssid = "";
const char* password = "";

const uint16_t IrPin = 4; // ESP32 GPIO pin to use. Recommended: (D4).
int temp = 25;
IRsend irsend(IrPin);  // Set the GPIO to be used to sending the message.
IRGreeAC irgree(IrPin, YAW1F, false, true);


// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
const char* mqtt_server = "mqtt.bordery.net";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

//uncomment the following lines if you're using SPI
/*#include <SPI.h>
#define BME_SCK 18
#define BME_MISO 19
#define BME_MOSI 23
#define BME_CS 5*/



// LED Pin
const int ledPin = 4;

void setup() {

    irsend.begin();
  #if ESP8266
  Serial.begin(115200, SERIAL_8N1, SERIAL_TX_ONLY);
  #else  // ESP8266
  Serial.begin(115200, SERIAL_8N1);
  #endif  // ESP8266
  Serial.begin(115200);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(ledPin, OUTPUT);
}

void updateTemp(int target_temp){
  irgree.setTemp(target_temp);
  irgree.send(2);
}


void turnOn(){

  irgree.begin();
  irgree.stateReset();
  irgree.on();
  irgree.setMode(kGreeCool); // kGreeCool kGreeHeat kGreeDry
  irgree.setIFeel(false);
  irgree.setLight(true);
  irgree.setSwingVertical(false, kGreeSwingMiddleUp); // kGreeSwingUp kGreeSwingMiddleUp kGreeSwingMiddleUp kGreeSwingMiddleDown kGreeSwingDown 
 // irgree.setSwingVertical(true, kGreeSwingUp); //  kGreeSwingAuto kGreeSwingDownAuto kGreeSwingMiddleAuto kGreeSwingUpAuto 
  irgree.setFan(1);// Set the speed of the fan, 0-3, 0 is auto, 1-3 is the speed
  irgree.setTemp(temp);
  irgree.send(2);


}

void turboModeOn(){
  irgree.setTurbo(true);
  irgree.send(2);
}

void turboModeOff(){
  irgree.setTurbo(false);
  irgree.send(2);
}



void turnOff(){
  irgree.stateReset();
  irgree.off();
  irgree.send(2);
  
}
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
  Serial.println(String(topic));

  if (String(topic) == "esp32/room0/ac0/setState") {
    Serial.print("Changing output to ");
    if(messageTemp == "on"){
      Serial.println("on");
      digitalWrite(ledPin, HIGH);
      turnOn();
      char temp_str[3];
      sprintf(temp_str, "%d", temp);
    }
    else if(messageTemp == "off"){
      Serial.println("off");
      digitalWrite(ledPin, LOW);
      turnOff();
    }
   
  }

  else if (String(topic) == "esp32/room0/ac0/setTemp") {
    const char* string1 = messageTemp.c_str();
   int current_temp = atoi(string1);
     updateTemp(current_temp);
     temp = current_temp;
     //client.publish("esp32/room0/ac0/targetTemp", string1);

  }
  else if (String(topic) == "esp32/room0/ac0/setFan") {
   Serial.println("Set fan is received");
     if (messageTemp == "Level 1"){
       Serial.println(irgree.toString());
      Serial.println("fan1");
      irgree.setFan(1);
      irgree.send(2);
     }
     else if (messageTemp == "Level 2") {
      irgree.setFan(2);
      irgree.send(2);
     }
     else if (messageTemp == "Level 3") {
      irgree.setFan(3);
      irgree.send(2);
     }
     else if (messageTemp == "Auto"){
      irgree.setFan(0);
      irgree.send(2);
     }
  }
  else if  (String(topic) == "esp32/room0/ac0/setMode"){
    Serial.println("SetMode is received");
      if (messageTemp == "Auto"){
      Serial.println("Auto");
       irgree.setMode(kGreeAuto);
      irgree.send(2);
     }
     else if (messageTemp == "Cool") {
       irgree.setMode(kGreeCool);
      irgree.send(2);
     }
     else if (messageTemp == "Heat") {
      irgree.setMode(kGreeHeat);
      irgree.send(2);
     }
     else if (messageTemp == "Dry"){
      irgree.setMode(kGreeDry);
      irgree.send(2);
     }
     else if (messageTemp == "Fan"){
      irgree.setMode(kGreeFan);
      irgree.send(2);
     }
  }

  else if (String(topic) == "esp32/room0/ac0/setSwing"){
    Serial.println("SetSwing is received");
          if (messageTemp == "Swing Auto"){
      Serial.println("Auto");
       irgree.setSwingVertical(true, kGreeSwingAuto);
      irgree.send(2);
     }
     else if (messageTemp == "Swing Up") {
      irgree.setSwingVertical(true, kGreeSwingUp);
      irgree.send(2);
     }
     else if (messageTemp == "Swing Middle") {
      irgree.setSwingVertical(true, kGreeSwingMiddle);
      irgree.send(2);
     }
     else if (messageTemp == "Swing Down"){
      irgree.setSwingVertical(true, kGreeSwingDown);
      irgree.send(2);
     }

  }
  else if (String(topic) == "esp32/room0/ac0/setTurbo"){
    Serial.println("SetTurbo is received");
    //irgree.setTurbo(true);
      if(messageTemp == "on"){
     irgree.setTurbo(true);
     irgree.send(2);
    }
    else if(messageTemp == "off"){
     irgree.setTurbo(false);
     irgree.send(2);
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("esp32/room0/ac0/setState");
      client.subscribe("esp32/room0/ac0/setTemp");
      client.subscribe("esp32/room0/ac0/setMode");
      client.subscribe("esp32/room0/ac0/setSwing");
      client.subscribe("esp32/room0/ac0/setTurbo");
       client.subscribe("esp32/room0/ac0/setFan");
      //char temp_str = temp + '0';
     // client.publish("esp32/room0/ac0/targetTemp",temp_str);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    char temp_str[3];
    char status_str[100];
    sprintf(temp_str, "%d", temp);
    client.publish("esp32/room0/ac0/targetTemp", temp_str);
    Serial.println(irgree.toString());
    irgree.toString().toCharArray(status_str,100);
    client.publish("esp32/room0/ac0/setModeStatus",status_str);
     
}
}
