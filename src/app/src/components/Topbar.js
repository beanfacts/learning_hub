import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Clock from "./Clock";
import axios from "../axios";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  left: {
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.3)",
  },
  center: {
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.3)",
  },
  right: {
    textAlign: "right",
    padding: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.3)",
  },
}));

const Topbar = () => {
  const [building, setBuilding] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    //axios function
    async function fetchdata() {
      const request = await axios.get("/api/");
      console.log(request.data.results);
      return request;
    }
    fetchdata();
  }, []);

  return (
    <Grid item xs={12}>
      <Grid item xs container>
        <Grid item xs={4}>
          <h1 className={classes.left}>
            <Clock />
          </h1>
        </Grid>
        <Grid item xs={4}>
          <h1 className={classes.center}>706</h1>
        </Grid>
        <Grid item xs={4}>
          <h1 className={classes.right}>HM</h1>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Topbar };
