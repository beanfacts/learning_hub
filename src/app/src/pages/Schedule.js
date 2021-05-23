import React from "react";
import Grid from "@material-ui/core/Grid";
import { Topbar } from "../components/Topbar";
import { SchedulerCard } from "../components/SchedulerCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  parentPaper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "95%",
  },
}));

function Schedule() {
  const classes = useStyles();
  return (
    <>
      <div className="App-header">
        <Grid container spacing={2} className={classes.parentPaper}>
          <Topbar />
          {/* <SchedulerCard /> */}
        </Grid>
      </div>
      {/* <div className="App-header"></div> */}
    </>
  );
}

export default Schedule;
