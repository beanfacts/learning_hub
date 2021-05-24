import CircularProgress from "@material-ui/core/CircularProgress";
import Unlocked from "@material-ui/icons/LockOpenOutlined";
import Locked from "@material-ui/icons/LockOutlined";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "../axios";

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
    color: theme.palette.text.secondary,
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  icons: {
    fontSize: "12rem",
    color: "#b2b2b2",
  },
}));

const LockCard = ({ room }) => {
  const classes = useStyles();
  const [cabinet, setCabinet] = useState({});
  const [loading, setLoading] = useState(false);

  const lights = async () => {
    var path = `/things?room_id=${room}&type=cabinet`;
    await axios.get(path, head).then((res) => {
      setCabinet(res.data.result.things);
      console.log(cabinet);
    });
    setLoading(true);
  };
  useEffect(() => {
    lights();
  }, [loading]);

  const handleClick = () => {
    console.log(cabinet[Object.keys(cabinet)].sensors.desired);
    const body = {
      state:
        cabinet[Object.keys(cabinet)].sensors.desired.state === "locked"
          ? "unlocked"
          : "locked",
    };
    axios
      .post(`/control?thing_id=${Object.keys(cabinet)}`, body, head)
      .then(() => {
        const key = [Object.keys(cabinet)];
        setCabinet({
          ...cabinet,
          [key]: {
            ...cabinet[key],
            sensors: {
              ...cabinet[key].sensors,
              desired: {
                ...cabinet[key].sensors.desired,
                state: body.state,
              },
            },
          },
        });
      })
      .catch((err) => {});
  };
  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          {cabinet[Object.keys(cabinet)].sensors.desired.state === "locked" ? (
            <div>
              <IconButton
                color="primary"
                component="span"
                onClick={handleClick}
              >
                <Locked className={classes.icons} />
              </IconButton>
              <h3>{cabinet[Object.keys(cabinet)].sensors.desired.state}</h3>
            </div>
          ) : (
            <div>
              <IconButton
                color="primary"
                component="span"
                onClick={handleClick}
              >
                <Unlocked className={classes.icons} />
              </IconButton>
              <h3>{cabinet[Object.keys(cabinet)].sensors.desired.state}</h3>
            </div>
          )}
        </Paper>
      ) : (
        <div className={classes.first}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export { LockCard };
