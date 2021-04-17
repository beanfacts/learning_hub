import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import BulbIcon from "@material-ui/icons/WbIncandescentRounded";
import Switch from "@material-ui/core/Switch";

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

const LightCard = () => {
  const classes = useStyles();
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checkedD: false,
  });
  return (
    <Paper className={classes.first}>
      <br />
      <br />
      <br />
      <Grid item xs={12}>
        <Grid item xs container direction="row">
          <Grid item xs={6}>
            {state.checkedA ? (
              <BulbIcon className={classes.BulbIconLit} />
            ) : (
              <BulbIcon className={classes.BulbIcon} />
            )}
          </Grid>
          <Grid item xs={6}>
            {state.checkedB ? (
              <BulbIcon className={classes.BulbIconLit} />
            ) : (
              <BulbIcon className={classes.BulbIcon} />
            )}
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={state.checkedA}
              onChange={handleChange}
              color="primary"
              name="checkedA"
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={state.checkedB}
              onChange={handleChange}
              color="primary"
              name="checkedB"
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row">
          <Grid item xs={6}>
            {state.checkedC ? (
              <BulbIcon className={classes.BulbIconLit} />
            ) : (
              <BulbIcon className={classes.BulbIcon} />
            )}
          </Grid>
          <Grid item xs={6}>
            {state.checkedD ? (
              <BulbIcon className={classes.BulbIconLit} />
            ) : (
              <BulbIcon className={classes.BulbIcon} />
            )}
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={state.checkedC}
              onChange={handleChange}
              color="primary"
              name="checkedC"
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={state.checkedD}
              onChange={handleChange}
              color="primary"
              name="checkedD"
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { LightCard };
