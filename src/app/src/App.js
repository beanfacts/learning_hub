import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Topbar } from "./components/Topbar";
import { SchedulerCard } from "./components/SchedulerCard";
import { Register } from "./components/Register";
import "./App.css";
// import Paper from "@material-ui/core/Paper";
// import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
// import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";
// import { LightCard } from "./components/LightCard";
// import { AcCard } from "./components/AcCard";

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
  // const videoConnected = true;
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
          <Tab label="Scheduler" {...a11yProps(0)} />
          {/* <Tab label="Controller" {...a11yProps(1)} /> */}
        </Tabs>
      </AppBar>
      <div className="App-header">
        <TabPanel value={value} index={0}>
          <Grid container spacing={2} className={classes.parentPaper}>
            {/* <Register /> */}
            <Topbar />
            <SchedulerCard />
          </Grid>
        </TabPanel>
      </div>
    </>
  );
}
