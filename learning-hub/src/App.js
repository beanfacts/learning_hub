import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";
import { Topbar } from "./components/Topbar";
import { LightCard } from "./components/LightCard";
import { AcCard } from "./components/AcCard";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
  },
  parentPaper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "90%",
  },
  icons: {
    fontSize: "10rem",
    color: "rgba(0, 0, 0, 0.3)",
  },
}));

export default function AutoGrid() {
  const classes = useStyles();
  const videoConnected = true;
  return (
    <>
      <div className="App-header">
        <div className={classes.root}>
          <Grid container spacing={2} className={classes.parentPaper}>
            {/* top most line of the app where time is located */}
            <Topbar></Topbar>
            <Grid item xs={12} container direction="row">
              <Grid spacing={2} item xs container>
                {/* video container */}
                <Grid item xs={4}>
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
                </Grid>
                {/* light container */}
                <Grid item xs={4} zeroMinWidth>
                  <LightCard></LightCard>
                </Grid>
                {/* ac container */}
                <Grid item xs={4} zeroMinWidth>
                  <AcCard></AcCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
