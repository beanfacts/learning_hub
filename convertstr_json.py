#https://github.com/crankyoldgit/IRremoteESP8266/blob/master/test/ir_Gree_test.cpp 
#The site above is used for an example of various functions available in the ac.

import json

#Current known variables:
#model: can be something like yaw1f
#power: can be either 1 or 0, meaning that 1 == on, 0 == off
#mode: this can output: auto, cool, heat, dry ,fan
#fan: this can show auto, low, medium, high
#turbo:  can be either 1 or 0, meaning that 1 == on, 0 == off
#ifeel:  can be either 1 or 0, meaning that 1 == on, 0 == off (this function is not implemented in the ac code)
#wifi: can be either 1 or 0, meaning that 1 == on, 0 == off (this function is not implemented in the ac code)
#xfan: can be either 1 or 0, meaning that 1 == on, 0 == off (this function is not implemented in the ac code)


#Current unknown variables:
#swing_level: This can be something like auto, up, middle, down, but to be sure, we need to check it with the real ac. (This function is implemented but we have not tested with the real AC yet whether it will output the values that I have described)

#swing_mode: I am not sure what is swing_mode, we will have to test it with the real AC. (this function is not implemented in the ac code)
#timer: not sure how to use, but from what i observer the value can be either 12:30(time format) or Off (this function is not implemented in the ac code)
#display_temp: I have no clue what is this for (this function is not implemented in the ac code)
#light: I am not sure what this does (this function is not implemented in the ac code)


#this code is used for testing when convert the string to Dict-JSON format


txt ="Model: 1 (YAW1F), Power: On, Mode: 1 (Cool), Temp: 16C, Fan: 3 (High), Turbo: On, IFeel: On, WiFi: On, XFan: On, Light: Off, Sleep: On, Swing(V) Mode: Auto, Swing(V): 1 (Auto), Timer: 12:30, Display Temp: 3 (Outside)"

txt2=  "Model: 1 (YAW1F), Power: On, Mode: 1 (Cool), Temp: 26C, Fan: 1 (Low), Turbo: Off, IFeel: Off, WiFi: Off, XFan: Off, Light: On, Sleep: Off, Swing(V) Mode: Manual, Swing(V): 2 (UNKNOWN), Timer: Off, Display Temp: 3 (Outside)"


def dataToJson(txt):
    x = i.lower().split(", ")
    for j in range(len(x)):
        y = x[j].split(":")
        y[1] = y[1].strip(" ")
        if(y[0] == "swing(v) mode"):
            y[0] = "swing_mode"
        if(y[0] == "swing(v)"):
            y[0] = "swing_level"
        if (y[0] == "display temp"):
            y[0] = "display_temp"
        if y[0] != "temp" and y[0] != "timer":
            y[1] = y[1].strip("1 2 3 4 5 6 7 8 9 0")
        if y[0] == "timer" and y[1] != "on" and y[1] != "off" :
            y[1] = y[1] + ":" + y[2]
            y.remove(y[2])
        if y[0] == "temp":
            y[1] =  int(y[1].strip("c"))
        if y[0] != "temp":
            y[1] = y[1].strip(" ()")
        if y[1] == "":
            y[1] = None
        if y[1] == "on":
            y[1] = 1
        if y[1] == "off":
            y[1] = 0
        info[y[0]] = y[1]
        json_obj = json.dumps(info)
    return json_obj

info = {}
arr = [txt,txt2]
for i in arr:
    result = dataToJson(i)
    print(result)


"""
outputs generated:
{'model': 'yaw1f', 'power': 1, 'mode': 'cool', 'temp': 16, 'fan': 'high', 'turbo': 1, 'ifeel': 1, 'wifi': 1, 'xfan': 1, 'light': 0, 'sleep': 1, 'swing_mode': 'auto', 'swing_level': 'auto', 'timer': '12:30', 'display_temp': 'outside'}
{'model': 'yaw1f', 'power': 1, 'mode': 'cool', 'temp': 26, 'fan': 'low', 'turbo': 0, 'ifeel': 0, 'wifi': 0, 'xfan': 0, 'light': 1, 'sleep': 0, 'swing_mode': 'manual', 'swing_level': 'unknown', 'timer': 0, 'display_temp': 'outside'}
"""
