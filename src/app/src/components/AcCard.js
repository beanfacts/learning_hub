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
  headers: { sessid: sessionStorage.getItem("sessid") },
};

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
  load: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
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
  const [acexist, setAcexist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");

  // const [checked, setChecked] = useState(false);
  const aircond = async () => {
    try {
      var path = `/things?room_id=${room}&type=ac`;
      const res = await axios.get(path, head).then((res) => {
        setAcdata(res.data.result.things);
        if (Object.keys(res.data.result.things).length === 0) {
          setAcexist(false);
        } else {
          setAcexist(true);
        }
      });
      setLoading(true);
      // console.log(res.data);
    } catch (e) {
      console.log(e.result);
    }
  };
  // const key = Object.keys(acdata.things)[0];
  // console.log("KEY", key)
  const ac_name = Object.keys(acdata)[0];
  useEffect(() => {
    aircond();
  }, []);

  // handle state change - on/off
  const handleChange = (event) => {
    // setChecked((prev)=>!prev);
    setAcdata({
      ...acdata,
      [ac_name]: {
        ...acdata[ac_name],
        sensors: {
          ...acdata[ac_name].sensors,
          desired: {
            ...acdata[ac_name].sensors.desired,
            state: Number(event.target.checked),
          },
        },
      },
    });
    console.log(event.target.checked);
    // console.log("REPORTED", acdata[ac].sensors.reported.state)
    acdata[ac_name].sensors.desired.state = Number(event.target.checked);
    axios
      .post(
        `/control?thing_id=${ac_name}`,
        acdata[ac_name].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // handle temp change
  const handleTempChange = (ac_name) => (e, data) => {
    setAcdata({
      ...acdata,
      [ac_name]: {
        ...acdata[ac_name],
        sensors: {
          ...acdata[ac_name].sensors,
          desired: {
            ...acdata[ac_name].sensors.desired,
            temp: data,
          },
        },
      },
    });
    acdata[ac_name].sensors.desired.temp = data;
    axios
      .post(
        `/control?thing_id=${ac_name}`,
        acdata[ac_name].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // //handle fan change
  const handleFanChange = (val) => {
    setAcdata({
      ...acdata,
      [ac_name]: {
        ...acdata[ac_name],
        sensors: {
          ...acdata[ac_name].sensors,
          desired: {
            ...acdata[ac_name].sensors.desired,
            fan: val,
          },
        },
      },
    });
    acdata[ac_name].sensors.desired.fan = val;
    axios
      .post(
        `/control?thing_id=${ac_name}`,
        acdata[ac_name].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // //handle mode change
  const handleModeChange = (event) => {
    setAcdata({
      ...acdata,
      [ac_name]: {
        ...acdata[ac_name],
        sensors: {
          ...acdata[ac_name].sensors,
          desired: {
            ...acdata[ac_name].sensors.desired,
            mode: event.target.value,
          },
        },
      },
    });
    acdata[ac_name].sensors.desired.mode = event.target.value;
    axios
      .post(
        `/control?thing_id=${ac_name}`,
        acdata[ac_name].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // //handle mode change
  const handleSwingChange = (event) => {
    setAcdata({
      ...acdata,
      [ac_name]: {
        ...acdata[ac_name],
        sensors: {
          ...acdata[ac_name].sensors,
          desired: {
            ...acdata[ac_name].sensors.desired,
            swing: event.target.value,
          },
        },
      },
    });
    // console.log(event.target.value);
    acdata[ac_name].sensors.desired.swing = event.target.value;
    axios
      .post(
        `/control?thing_id=${ac_name}`,
        acdata[ac_name].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // console.log(acdata);
  //Get the thing name (ac name eg.brightAc)
  // const ac_name = Object.keys(acdata)[0];
  // console.log("AC", ac)
  return (
    <>
      {loading && acexist ? (
        <Paper className={classes.first}>
          <Grid item xs={12}>
            <h1 className={classes.fonts}>
              {acdata[ac_name].sensors.desired.temp}
              °C
            </h1>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Switch
              value={acdata[ac_name].sensors.desired.state}
              checked={acdata[ac_name].sensors.desired.state}
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
                acdata[ac_name].sensors.desired.temp == null
                  ? 24
                  : acdata[ac_name].sensors.desired.temp
              }
              onChange={handleTempChange(ac_name)}
              disabled={acdata[ac_name].sensors.desired.state ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
            <ButtonGroup
              size="medium"
              color="primary"
              aria-label="large outlined primary button group"
              disabled={acdata[ac_name].sensors.desired.state ? false : true}
            >
              <Button
                onClick={() => {
                  handleFanChange(0);
                }}
              >
                Auto
              </Button>
              <Button
                onClick={() => {
                  handleFanChange(1);
                }}
              >
                Low
              </Button>
              <Button
                onClick={() => {
                  handleFanChange(2);
                }}
              >
                Mid
              </Button>
              <Button
                onClick={() => {
                  handleFanChange(3);
                }}
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
                  value={acdata[ac_name].sensors.desired.mode}
                  onChange={handleModeChange}
                  disabled={
                    acdata[ac_name].sensors.desired.state ? false : true
                  }
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
                  value={acdata[ac_name].sensors.desired.swing}
                  onChange={handleSwingChange}
                  disabled={
                    acdata[ac_name].sensors.desired.state ? false : true
                  }
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
        <div className={classes.load}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};
export { AcCard };
