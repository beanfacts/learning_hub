import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Clock from "./Clock";

const useStyles = makeStyles((theme) => ({
  left: {
    textAlign: "-moz-left",
    color: "rgba(0, 0, 0, 0.3)",
  },
  center: {
    textAlign: "-moz-center",
    color: "rgba(0, 0, 0, 0.3)",
  },
  right: {
    textAlign: "-moz-right",
    padding: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.3)",
  },
}));

const Topbar = () => {
  const classes = useStyles();
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
