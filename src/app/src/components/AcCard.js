import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  CircularProgress,
  ButtonGroup,
  InputLabel,
  MenuItem,
  Switch,
  Select,
  Slider,
  Button,
  Paper,
  Grid,
} from "@material-ui/core";
import axios from "../axios";
import React, { useEffect, useState } from "react";

const head = {
  headers: {"sessid": sessionStorage.getItem("sessid")}
}

const useStyles = makeStyles((theme) => ({
  center: {
    textAlign: "-moz-center",
    color: "#b2b2b2",
  },
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    height: "90%",
  },
  fonts: {
    fontSize: "5rem",
    color: "#b2b2b2",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "90%",
  },
}));

const AcCard = ({ room }) => {
  const classes = useStyles();

  const marks = [
    {
      value: 16,
      label: "16°C",
    },
    {
      value: 20,
      label: "20°C",
    },
    {
      value: 26,
      label: "26°C",
    },
    {
      value: 30,
      label: "30°C",
    },
  ];

  const [acdata, setAcdata] = useState({});
  const [acexist, setAcexist] = useState(true);
  const [loading, setLoading] = useState(false);
  const [haveData, setHaveData] = useState(false);
  const aircond = async () => {
    try {
      var path = `/things?room_id=${room}&type=ac`;
      const res = await axios.get(path,head).then((res) => {
        setAcdata(res.data.result.things);
        if(acdata!=null){
          setHaveData(true);
        }
        console.log("STATE", res.data.result.things);
        console.log("ACDATA", acdata.brightAc)
      });
      setLoading(true)
      // console.log(res.data);
      if (acdata[Object.keys(acdata)[0]] === undefined) {
        setAcexist(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // const key = Object.keys(acdata.things)[0];
  // console.log("KEY", key)
  useEffect(() => {
    aircond();

  },[haveData]);

  // handle state change - on/off
  const handleChange = (event) => {
    setAcdata({
      ...acdata.brightAc.sensors,
      reported:{
        state: event.target.checked
      }
      // ...acdata.things.brightAc.sensors,
      // sensors:{
      //   ...acdata.things.brightAc.sensors.reported,
      //   reported:{
      //     state: event.target.checked
      //   },
      // },
      // ...acdata,
      // things: {
      //   ...acdata.things,
      //   brightAc: {
      //     ...acdata.things.brightAc,
      //     sensors: {
      //       ...acdata.things.brightAc.sensors,
      //       reported: {
      //         state: 1
      //       }
      //     }
      //   }
      // }
      // [event.target.name]: {
      //   ...acdata[event.target.name].things.brightAc.sensors,
      //   reported: {
      //     ...acdata[event.target.name].things.brightAc.sensors.reported,
      //     state: event.target.checked,
      //   },
      // },
    });
    acdata.brightAc.sensors.reported.state = event.target.checked;
    axios
      .post(`/control?thing_id=brightAc`, acdata.brightAc.sensors.reported.state, head)
      .then(() => (error) => {
        console.log(error);
      });
  };

  // // handle temp change
  // const handleTempChange = (name) => (e, data) => {
  //   setAcdata({
  //     ...acdata.things.brightAc.sensors,
  //     reported: {
  //       ...acdata[ac_keys].things.brightAc.sensors.reported,
  //       temp: data,
  //     },
  //   });

  //   let id = name;
  //   axios
  //     .post(`/control?id=${ac_keys[0]}`, acdata[ac_keys[0]].things.brightAc.sensors.temp)
  //     .then(() => (error) => {
  //       console.log(error);
  //     });
  // };

  // //handle fan change
  // const handleFanChange = (val) => {
  //   setAcdata({
  //     ...acdata,
  //     [ac_keys[0]]: {
  //       ...acdata[ac_keys[0]].things.brightAc.sensors,
  //       reported: {
  //         ...acdata[ac_keys[0]].things.brightAc.sensors.reported,
  //         fan: val,
  //       },
  //     },
  //   });
  //   let id = ac_keys[0];
  //   acdata[id].things.brightAc.sensors.fan = val;
  //   axios
  //     .post(`/control?id=${ac_keys[0]}`, acdata[id].things.brightAc.sensors.fan, head)
  //     .then(() => (error) => {
  //       console.log(error);
  //     });
  // };

  // //handle mode change
  // const handleModeChange = (event) => {
  //   setAcdata({
  //     ...acdata,
  //     [ac_keys[0]]: {
  //       ...acdata[ac_keys[0]].things.brightAc.sensors,
  //       reported: {
  //         ...acdata[ac_keys[0]].things.brightAc.sensors.reported,
  //         mode: event.target.value,
  //       },
  //     },
  //   });
  //   let id = ac_keys[0];
  //   // console.log(event.target.value);
  //   acdata[id].things.brightAc.sensors.mode = event.target.value;
  //   axios
  //     .post(`/control?id=${ac_keys[0]}`, acdata[id].things.brightAc.sensors.mode, head)
  //     .then(() => (error) => {
  //       console.log(error);
  //     });
  // };

  // //handle mode change
  // const handleSwingChange = (event) => {
  //   setAcdata({
  //     ...acdata,
  //     [ac_keys[0]]: {
  //       ...acdata[ac_keys[0]].things.brightAc.sensors,
  //       reported: {
  //         ...acdata[ac_keys[0]].things.brightAc.sensors.reported,
  //         swing: event.target.value,
  //       },
  //     },
  //   });
  //   let id = ac_keys[0];
  //   console.log(event.target.value);
  //   acdata[id].things.brightAc.sensors.swing = event.target.value;
  //   axios
  //     .post(`/control?id=${ac_keys[0]}`, acdata[id].things.brightAc.sensors.swing, head)
  //     .then(() => (error) => {
  //       console.log(error);
  //     });
  // };
  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          <Grid item xs={12}>
            <h1 className={classes.fonts}>
              {acdata.brightAc.sensors.reported.temp}
              °C
            </h1>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Switch
              checked={acdata.brightAc.sensors.reported.state}
              onChange={handleChange}
              color="primary"
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Slider
              aria-labelledby="discrete-slider-always"
              step={1}
              marks={marks}
              valueLabelDisplay="auto"
              min={16}
              max={30}
              value={
                acdata.brightAc.sensors.temp == null
                  ? 24
                  : acdata.brightAc.sensors.temp
              }
              // onChange={handleTempChange(ac_keys[0])}
              disabled={acdata.brightAc.sensors.state ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
            <ButtonGroup
              size="medium"
              color="primary"
              aria-label="large outlined primary button group"
              disabled={acdata.brightAc.sensors.state ? false : true}
            >
              <Button
                // onClick={() => {
                //   handleFanChange(0);
                // }}
              >
                Auto
              </Button>
              <Button
                // onClick={() => {
                //   handleFanChange(1);
                // }}
              >
                Low
              </Button>
              <Button
                // onClick={() => {
                //   handleFanChange(2);
                // }}
              >
                Mid
              </Button>
              <Button
                // onClick={() => {
                //   handleFanChange(3);
                // }}
              >
                High
              </Button>
            </ButtonGroup>
          </Grid>
          <br />
          <Grid item xs={12} container direction="row">
            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                <Select
                  labelId="mode-select-label"
                  id="mode-select"
                  value={acdata.brightAc.sensors.mode}
                  // onChange={handleModeChange}
                  disabled={acdata.brightAc.sensors.state ? false : true}
                >
                  <MenuItem value={"auto"}>Auto</MenuItem>
                  <MenuItem value={"heat"}>Heat</MenuItem>
                  <MenuItem value={"dry"}>Dry</MenuItem>
                  <MenuItem value={"cool"}>Cool</MenuItem>
                  <MenuItem value={"fan"}>Fan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Swingmode</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={acdata.brightAc.sensors.swing}
                  // onChange={handleSwingChange}
                  disabled={acdata.brightAc.sensors.state ? false : true}
                >
                  <MenuItem value={"auto"}>Auto</MenuItem>
                  <MenuItem value={"up"}>Up</MenuItem>
                  <MenuItem value={"middle"}>Middle</MenuItem>
                  <MenuItem value={"down"}>Down</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.fab}></Grid>
          </Grid>
        </Paper>
      ) : (
        <div className={classes.first}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};
export { AcCard };
