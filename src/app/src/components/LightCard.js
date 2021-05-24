import React, { useEffect, useState, useLayoutEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import BulbIcon from "@material-ui/icons/WbIncandescentRounded";
import useDidMountEffect from "./useDidMountEffect";
import Switch from "@material-ui/core/Switch";
import axios from "../axios";

const head = {
  headers: { sessid: sessionStorage.getItem("sessid") },
};

const useStyles = makeStyles((theme) => ({
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  BulbIcon: {
    fontSize: "7rem",
    color: "#b2b2b2",
  },
  BulbIconLit: {
    fontSize: "7rem",
    color: "#ffde3b",
  },
}));

const LightCard = ({ room }) => {
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [sensors, setSensors] = useState({"state":[]});

  const lights = async () => {
    try {
      var path = `/things?room_id=${room}&type=light`;
      await axios.get(path, head).then((res) => {
        setThings(res.data.result.things);
        // setSensors(things[Object.keys(things)[0]].sensors.desired.state);
        console.log(things);
      });
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    lights();
  }, []);

  const handleChange = (val) => (event) => {
    var temp = things[Object.keys(things)[0]].sensors.desired.state;
    temp[val] = event.target.checked;
    setThings({
      ...things,
      [event.target.name]: {
        ...things[event.target.name], // gets all the previous values
        sensors: {
          ...things[event.target.name].sensors,
          desired: {
            state: temp,
          },
        },
      },
    });
    let id = event.target.name;
  };
  useDidMountEffect(() => {
    // console.log(things[Object.keys(things)[0]].sensors.desired.state);
    axios
      .post(
        `/control?thing_id=${Object.keys(things)[0]}`,
        things[Object.keys(things)[0]].sensors.desired,
        head
      )
      .then(() => (error) => {
        console.log(error);
      });
  }, [things]);

  console.log(things);
  const lights_keys = things[Object.keys(things)[0]];
  // if (loading) {
  //   const lights_keys.sensors.desired.state.length = lights_keys.sensors.desired.state.length;
  // }
  const classes = useStyles();
  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          <Grid item xs={12}>
            <Grid item xs container direction="row">
              <Grid item xs={6}>
                {lights_keys.sensors.desired.state.length > 0 &&
                lights_keys.sensors.desired.state[0] ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {lights_keys.sensors.desired.state.length > 1 &&
                lights_keys.sensors.desired.state[0] ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={
                    lights_keys.sensors.desired.state.length > 0 ? false : true
                  }
                  checked={
                    lights_keys.sensors.desired.state.length > 0
                      ? lights_keys.sensors.desired.state[0]
                      : false
                  }
                  onChange={handleChange(0)}
                  color="primary"
                  name={Object.keys(things)[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={
                    lights_keys.sensors.desired.state.length > 1 ? false : true
                  }
                  checked={
                    lights_keys.sensors.desired.state.length > 1
                      ? lights_keys.sensors.desired.state[0]
                      : false
                  }
                  onChange={handleChange(1)}
                  color="primary"
                  name={Object.keys(things)[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs container direction="row">
              <Grid item xs={6}>
                {lights_keys.sensors.desired.state.length > 2 &&
                lights_keys.sensors.desired.state[2] ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {lights_keys.sensors.desired.state.length > 3 &&
                lights_keys.sensors.desired.state[3] ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={
                    lights_keys.sensors.desired.state.length > 2 ? false : true
                  }
                  checked={
                    lights_keys.sensors.desired.state.length > 2
                      ? lights_keys.sensors.desired.state[2]
                      : false
                  }
                  onChange={handleChange(2)}
                  color="primary"
                  name={Object.keys(things)[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={
                    lights_keys.sensors.desired.state.length > 3 ? false : true
                  }
                  checked={
                    lights_keys.sensors.desired.state.length > 3
                      ? lights_keys.sensors.desired.state[3]
                      : false
                  }
                  onChange={handleChange(3)}
                  color="primary"
                  name={Object.keys(things)[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
            </Grid>
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

export { LightCard };
