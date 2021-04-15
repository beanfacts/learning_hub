import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Topbar } from "./components/Topbar";
import { LightCard } from "./components/LightCard";
import { AcCard } from "./components/AcCard";
import { SchedulerCard } from "./components/SchedulerCard";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AutoGrid() {
  const classes = useStyles();
  const videoConnected = true;
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <div className="App-header">
        <TabPanel value={value} index={0}>
          <Grid container spacing={2} className={classes.parentPaper}>
            <Topbar />
<<<<<<< HEAD
=======
            <SchedulerCard />
>>>>>>> dev/Lucky
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={classes.root}>
            <Grid container spacing={2} className={classes.parentPaper}>
              {/* top most line of the app where time is located */}
              <Topbar />
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
                    <LightCard />
                  </Grid>
                  {/* ac container */}
                  <Grid item xs={4} zeroMinWidth>
                    <AcCard />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </TabPanel>
      </div>
    </>
  );
}