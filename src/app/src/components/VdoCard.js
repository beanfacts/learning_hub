import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "../axios";

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
  },
  icons: {
    fontSize: "10rem",
    color: "#b2b2b2",
  },
}));

const VdoCard = ({ room }) => {
  const videoConnected = true;
  const classes = useStyles();
  useEffect(() => {
    //axios function
    async function fetchdata() {
      // TODO change to actual path
      var path = `/things?room_id=${room}`;
      const request = await axios.get(path);
      // console.log(request.data.results);
      return request;
    }
    fetchdata().then(
      (response) => {
        console.log(response);
        console.log(response.data);
        // console.log(request);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [room]);
  return (
    <Paper className={classes.first}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {videoConnected ? (
        <VideoIcon className={classes.icons} />
      ) : (
        <ErrorIcon className={classes.icons} />
      )}
    </Paper>
  );
};

export { VdoCard };
