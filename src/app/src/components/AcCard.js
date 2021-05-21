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

  const [acdata, setAcdata] = useState([]);
  const [acexist, setAcexist] = useState(true);
  const [loading, setLoading] = useState(false);

  const aircond = async () => {
    try {
      var path = `/things?room_id=${room}&type=ac`;
      const res = await axios.get(path).then((res) => {
        setAcdata(res.data.result);
      });
      setLoading(true);
      console.log(res);
      if (acdata[Object.keys(acdata)[0]] === undefined) {
        setAcexist(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    aircond();
  }, []);

  //handle state change - on/off
  const handleChange = (event) => {
    setAcdata({
      ...acdata,
      [event.target.name]: {
        ...acdata[event.target.name],
        sensors: {
          ...acdata[event.target.name].sensors,
          state: event.target.checked,
        },
      },
    });
    let id = event.target.name;
    console.log("Hello", id);
    acdata[id].sensors.state = event.target.checked;
    axios
      .post(`/control?id=${event.target.name}`, acdata[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };

  // handle temp change
  const handleTempChange = (name) => (e, data) => {
    setAcdata({
      ...acdata,
      [ac_keys[0]]: {
        ...acdata[ac_keys[0]],
        sensors: {
          ...acdata[ac_keys].sensors,
          temp: data,
        },
      },
    });

    let id = name;
    console.log(typeof acdata[ac_keys[0]].sensors.temp);
    console.log(typeof data);

    // acdata[id].sensors.temp = data.toFixed(2);
    axios
      .post(`/control?id=${ac_keys[0]}`, acdata[ac_keys[0]].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };

  //handle fan change
  const handleFanChange = (val) => {
    setAcdata({
      ...acdata,
      [ac_keys[0]]: {
        ...acdata[ac_keys[0]],
        sensors: {
          ...acdata[ac_keys[0]].sensors,
          fan: val,
        },
      },
    });
    let id = ac_keys[0];
    acdata[id].sensors.fan = val;
    axios
      .post(`/control?id=${ac_keys[0]}`, acdata[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };

  //handle mode change
  const handleModeChange = (event) => {
    setAcdata({
      ...acdata,
      [ac_keys[0]]: {
        ...acdata[ac_keys[0]],
        sensors: {
          ...acdata[ac_keys[0]].sensors,
          mode: event.target.value,
        },
      },
    });
    let id = ac_keys[0];
    console.log(event.target.value);
    acdata[id].sensors.mode = event.target.value;
    axios
      .post(`/control?id=${ac_keys[0]}`, acdata[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };

  //handle mode change
  const handleSwingChange = (event) => {
    setAcdata({
      ...acdata,
      [ac_keys[0]]: {
        ...acdata[ac_keys[0]],
        sensors: {
          ...acdata[ac_keys[0]].sensors,
          swing: event.target.value,
        },
      },
    });
    let id = ac_keys[0];
    console.log(event.target.value);
    acdata[id].sensors.swing = event.target.value;
    axios
      .post(`/control?id=${ac_keys[0]}`, acdata[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };
  const ac_keys = Object.keys(acdata);

  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          <Grid item xs={12}>
            <h1 className={classes.fonts}>
              {acdata[ac_keys[0]].sensors.temp == null
                ? 24
                : acdata[ac_keys[0]].sensors.temp}
              °C
            </h1>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Switch
              checked={acdata[ac_keys[0]].sensors.state}
              onChange={handleChange}
              color="primary"
              name={ac_keys[0]}
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
                acdata[ac_keys[0]].sensors.temp == null
                  ? 24
                  : acdata[ac_keys[0]].sensors.temp
              }
              onChange={handleTempChange(ac_keys[0])}
              disabled={acdata[ac_keys[0]].sensors.state ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
            <ButtonGroup
              size="medium"
              color="primary"
              aria-label="large outlined primary button group"
              disabled={acdata[ac_keys[0]].sensors.state ? false : true}
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
                  value={acdata[ac_keys[0]].sensors.mode}
                  onChange={handleModeChange}
                  disabled={acdata[ac_keys[0]].sensors.state ? false : true}
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
                  value={acdata[ac_keys[0]].sensors.swing}
                  onChange={handleSwingChange}
                  disabled={acdata[ac_keys[0]].sensors.state ? false : true}
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
