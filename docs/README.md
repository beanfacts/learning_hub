# Learning Hub API

Base URL  
`https://iff6r2m3p6.execute-api.ap-southeast-1.amazonaws.com/api/v1`

## IAM Examples
---

### Login
`POST /login?username=username&password=password`

Returns the token.

```json
{
    "result": {
        "token": "timd:faa03f6ffec91f2324c083885032fd3e"
    }
}
```

All other operations require authorization.  
Include the returned token in the header with the key `sessid`.

### Log out
`POST /logout`  
Returns if logged out
```json
{
    "result": {
        "msg": "Logged out."
    }
}
```

### General authorization failures

Not logged in, or token invalid
```json
{
    "status": "failure",
    "reason": "Please log in before accessing the system."
}
```

## Thing database
---
### Get things
`GET /things`

URL Parameters (* - required)  
`room_id`  
`thing_id`  
`type`  

Returns on success
```json
{
    "result": {
        "things": {

            // Key is the thing_id
            "lh_cabinet1": {
                "type": "cabinet",
                "attributes": {
                    "room_id": "hm_601"
                },
                "sensors": {
                    
                    // The state requested by IoT Core
                    "desired": {
                        "state": "locked"
                    },

                    // The actual state of the device
                    "reported": {
                        "state": "locked"
                    }
                }
            },

            "brightAc": {
                "type": "ac",
                "attributes": {
                    "room_id": "hm_601"
                },
                "sensors": {
                    "desired": {
                        "temp": 24,
                        "fan": 1,
                        "mode": "heat",
                        "swing": "up",
                        "state": 1
                    },
                    "reported": {
                        "temp": 43,
                        "fan": 1,
                        "mode": "cool",
                        "swing": "auto",
                        "state": 1
                    },
                    "delta": {
                        "temp": 24,
                        "mode": "heat",
                        "swing": "up"
                    }
                }
            },
            
            "lh_ApiTestThing": {
                "type": "light",
                "attributes": {
                    "room_id": "hm_601"
                },
                "sensors": {
                    "desired": {
                        "state": [
                            false,
                            true,
                            true,
                            false
                        ]
                    },
                    "reported": {
                        "state": [
                            true,
                            true,
                            true,
                            false
                        ]
                    },
                    "delta": {
                        "state": [
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                }
            }
        }
    }
}
```

### Modify thing state  
`POST /control`

URL Parameters (* - required)  
`thing_id` *  

Include the key/value pairs you want to change in the request body.

Body
```json
{
    // You can only include the ones you want to change, 
    // instead of providing all the available attributes
    "state": 1,
    "temp": 25
}
```

Returns
```json
{
    "result": {
        
        // Status message
        "msg": "Performed device updates." | "Did not perform device updates.",
        
        // The list of keys as reported by the IoT devices
        "reported_keys": [
            "state",
            "temp",
            "fan"
        ],
        
        // The list of keys available in the "desired" section
        "desired_keys": [
            "state",
            "temp",
            "fan"
        ],

        // The list of keys updated by the system
        "updated_keys": [
            "state",
            "temp"
        ],

        // Summary of what keys have been updated and in what section
        "update_summary": {
            "desired": {
                "state": 1,
                "temp": 25
            }
        }

    }
}
```


## Scheduling system examples
---
### View available schedules
`GET /schedule`

Finds schedules, using the following rule:  
```
  (room_id = room_id)
AND
  (course_start_time >= start_time AND course_start_time <= end_time)
AND
  (course_end_time >= start_time AND course_end_time <= end_time)
```

URL Parameters (* - required)   
`room_id` *  
`start_time` *  
`end_time` *  

Body  
None

Returns on success  
```json
{
    "result": [
            {
                "course_id": "Unassigned",
                "reservation_id": "BL3qTJxqC2E",
                "start_time": 1621735200,
                "description": "Test scheduled event!",
                "end_time": 1621746001,
                "actions": [],
                "room_id": "hm_601",
                "username": "admin"
            },
            {
                "course_id": 1,
                "reservation_id": "LOy85kzo",
                "username": "admin",
                "start_time": 1621587600,
                "end_time": 1621598400,
                "description": "Personal Meeting",
                "actions": [],
                "room_id": "hm_601",
                "username": "admin"
            }
    ]
}
```

### Create scheduled item
`POST /schedule`

URL Parameters (* - required)  
None

Body
```json
{
    "room_id": "hm_601",        // Required
    "start_time": 1621735200,   // Required
    "end_time": 1621746000,     // Required
    "description": "Test scheduled event!",
    "course_id": 1
}
```

Returns on success  
```json
{
    "result": "OK"
}
```

Returns on conflict `409`
The list of conflicting events and their schedule entries.  
```json
{
    "result": {
        "msg": "There are conflicting scheduled events.",
        "events": [
            {
                "course_id": "Unassigned",
                "reservation_id": "BL3qTJxqC2E",
                "start_time": 1621735200,
                "description": "Test scheduled event!",
                "end_time": 1621746001,
                "actions": [],
                "room_id": "hm_601",
                "username": "admin"
            }
        ]
    }
}
```

### Update scheduled item
`PATCH /schedule`
> **Warning**
> You cannot update the room_id for a specific reservation.  
> It is part of the primary key; the reservation must be deleted.

URL Parameters (* - required)
None

Body
```json
{
    "room_id": "hm_601",              // Required
    "reservation_id": "BL3qTJxqC2E",  // Required
    "start_time": 1621735200,         // Required
    "end_time": 1621746000,           // Required
    "description": "Test scheduled event!",
    "course_id": "cs"
}
```

Returns on success  
The schedule entry which was updated, with its most recent values.
```json
{
    "result": {
        "current": {
            "course_id": "cs",
            "reservation_id": "BL3qTJxqC2E",
            "start_time": 1621735200,
            "description": "Test scheduled event!",
            "end_time": 1621746000,
            "actions": [],
            "room_id": "hm_601",
            "username": "admin"
        }
    }
}
```

Returns on conflict `409`
The list of conflicting events and their schedule entries.  
```json
{
    "result": {
        "msg": "There are conflicting scheduled events.",
        "events": [
            {
                "course_id": "blablabla",
                "reservation_id": "LOy85kzo",
                "username": "admin",
                "start_time": 1621587600,
                "end_time": 1621598400,
                "description": "Personal Meeting",
                "actions": [],
                "room_id": "hm_601",
                "username": "admin"
            }
        ]
    }
}
```

### Delete scheduled item
`DELETE /schedule`

URL Parameters (* - required)   
`room_id` *  
`reservation_id` *

Body
None

Returns on success  
The event that was deleted with all its old details.
```json
{
    "result": {
        "deleted": {
            "course_id": "cs",
            "reservation_id": "BL3qTJxqC2E",
            "username": "admin",
            "start_time": 1621735200,
            "description": "Test scheduled event!",
            "end_time": 1621746000,
            "actions": [],
            "room_id": "hm_601"
        }
    }
}
```

Returns on failure
The failure with its reason.
```json
{
    "status": "failure",
    "reason": "The event has already been deleted, or you do not have permission to delete it."
}
```

### Adding scheduled actions to events
For `POST` and `PATCH` requests, control actions can be scheduled. Note the following limitations:
- They are limited to the room the schedule was made in.
- Scheduled actions cannot be made if the time conflicts with another event.
- Scheduled actions can be pushed back into the event timeframe if other events are created.

To add events, add a key named `actions` in the request body along with the other parameters, such as start and end times.

Additional Value
```json
{
  "actions": [
    {
      "time": 1621735000,
      "thing_id": "4384490f",
      "action": {
        "fan": 3,
        "state": 1,
        "temp": 25
      }
    },
    {
      "time": 1621735200,
      "thing_id": "4384490f",
      "action": {
        "fan": 3,
        "state": 1,
        "temp": 25
      }
    },
  ]
}
```

The successful return value depends on whether `POST` or `PATCH` was used to update the
scheduled entry. See those sections for the return values.

Returns on conflict `409`
The list of conflicting events and their schedule entries.  
```json
{
    "result": {
        "msg": "Scheduled actions have conflicting events.",
        "events": [
            {
                "course_id": "blablabla",
                "reservation_id": "LOy85kzo",
                "username": "admin",
                "start_time": 1621587600,
                "end_time": 1621598400,
                "description": "Personal Meeting",
                "actions": [],
                "room_id": "hm_601",
                "username": "admin"
            }
        ]
    }
}
```