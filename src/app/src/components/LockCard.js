import CircularProgress from "@material-ui/core/CircularProgress";
import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icons: {
    fontSize: "10rem",
    color: "#b2b2b2",
  },
}));

const LockCard = ({ room }) => {
  const classes = useStyles();
  const [cabinet, setCabinet] = useState();
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
  }, []);

  return (
    <>
      {loading ? (
        <Paper className={classes.first}>
          {/* <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br /> */}
          {cabinet ? (
            <VideoIcon className={classes.icons} />
          ) : (
            <ErrorIcon className={classes.icons} />
          )}
        </Paper>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export { LockCard };
