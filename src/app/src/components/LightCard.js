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
    color: "rgba(0, 0, 0, 0.3)",
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
      const res = await axios.get(path).then((res) => {
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
    // setState({ ...state, [event.target.name]: event.target.checked });
    setThings({
      ...things,
      [event.target.name]: {
        ...things[event.target.name], // Spread the font object to preserve all values
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
                {things[Object.keys(things)[0]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {things[Object.keys(things)[1]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={Object.keys(things).length >= 1 ? false : true}
                  checked={
                    things[Object.keys(things)[0]].sensors.state ? true : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={Object.keys(things)[0]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={Object.keys(things).length > 1 ? false : true}
                  checked={
                    things[Object.keys(things)[1]].sensors.state ? true : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={Object.keys(things)[1]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs container direction="row">
              <Grid item xs={6}>
                {things[Object.keys(things)[2]].sensors.state ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                {Object.keys(things).length > 3 ? (
                  things[Object.keys(things)[3]].sensors.state
                ) : false ? (
                  <BulbIcon className={classes.BulbIconLit} />
                ) : (
                  <BulbIcon className={classes.BulbIcon} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={Object.keys(things).length > 2 ? false : true}
                  checked={
                    things[Object.keys(things)[2]].sensors.state ? true : false
                  }
                  onChange={handleChange}
                  color="primary"
                  name={Object.keys(things)[2]}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  disabled={Object.keys(things).length > 3 ? false : true}
                  checked={
                    Object.keys(things).length > 3
                      ? things[Object.keys(things)[3]].sensors.state
                      : false
                  }
                  onChange={() => handleChange}
                  color="primary"
                  name={Object.keys(things)[3]}
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
          <CircularProgress></CircularProgress>
        </div>
      )}
    </>
  );
};

export { LightCard };
