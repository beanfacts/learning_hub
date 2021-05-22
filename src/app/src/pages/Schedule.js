import React from 'react';
import Grid from "@material-ui/core/Grid";
import { Topbar } from "../components/Topbar";
import { SchedulerCard } from "../components/SchedulerCard";
import { makeStyles } from "@material-ui/core/styles";

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
  Button: {
    margin: "auto",
    alignItems: "top-right",
  },
}));

function Schedule(){
  const classes = useStyles();
    return(
        <div className="App-header">
          <Grid container spacing={2} className={classes.parentPaper}>
            <Topbar />
            <SchedulerCard />
          </Grid>
      </div>
    );
}

export default Schedule;