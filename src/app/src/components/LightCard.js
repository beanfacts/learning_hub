import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import BulbIcon from "@material-ui/icons/WbIncandescentRounded";
import Switch from "@material-ui/core/Switch";
import axios from "../axios";

const useStyles = makeStyles((theme) => ({
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
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

  const lights = async () => {
    try {
      var path = `/things?room_id=${room}&type=light`;
      await axios.get(path).then((res) => {
        setThings(res.data.result);
      });
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    lights();
  }, []);

  const handleChange = (event) => {
    setThings({
      ...things,
      [event.target.name]: {
        ...things[event.target.name], // gets all the previous values
        sensors: {
          state: event.target.checked,
        },
      },
    });
    let id = event.target.name;
    console.log(event.target.name);
    things[id].sensors.state = event.target.checked;
    axios
      .post(`/control?id=${event.target.name}`, things[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };
  const lights_num = Object.keys(things).length;
  const lights_keys = Object.keys(things);
  const classes = useStyles();
  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          <br />
          <br />
          <br />
          <Grid item xs={12}>
            <Grid item xs container direction="row">
              <Grid item xs={6}>
                {lights_num > 0 && things[lights_keys[0]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {lights_num > 1 && things[lights_keys[1]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={lights_num > 0 ? false : true}
                  checked={
                    lights_num > 0
                      ? things[lights_keys[0]].sensors.state
                      : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={lights_keys[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={lights_num > 1 ? false : true}
                  checked={
                    lights_num > 1
                      ? things[lights_keys[1]].sensors.state
                      : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={lights_keys[1]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs container direction="row">
              <Grid item xs={6}>
                {lights_num > 2 && things[lights_keys[2]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {lights_num > 3 && things[lights_keys[3]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={lights_num > 2 ? false : true}
                  checked={
                    lights_num > 2
                      ? things[lights_keys[2]].sensors.state
                      : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={lights_keys[2]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={lights_num > 3 ? false : true}
                  checked={
                    lights_num > 3
                      ? things[lights_keys[3]].sensors.state
                      : false
                  }
                  onChange={() => handleChange}
                  color="primary"
                  name={lights_keys[3]}
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
