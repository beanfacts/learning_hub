import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import React from "react";

const useStyles = makeStyles((theme) => ({
  center: {
    textAlign: "-moz-center",
    color: "rgba(0, 0, 0, 0.3)",
  },
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
  },
  fonts: {
    fontSize: "5rem",
    color: "rgba(0, 0, 0, 0.3)",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "90%",
  },
}));

const AcCard = () => {
  const classes = useStyles();
  const [fan, setFan] = React.useState([24]);
  const [mode, setMode] = React.useState("");
  const [swing, setSwing] = React.useState("");
  const updateTemp = (e, data) => {
    setFan(data);
  };
  const updateMode = (event) => {
    setMode(event.target.value);
  };
  const updateSwing = (event) => {
    setSwing(event.target.value);
  };

  const [ac, setAC] = React.useState(false);
  const handleAC = (event) => {
    setAC((prev) => !prev);
  };
  const marks = [
    {
      value: 16,
      label: "16°C",
    },
    {
      value: 20,
      label: "20°C",
    },
    {
      value: 26,
      label: "26°C",
    },
    {
      value: 30,
      label: "30°C",
    },
  ];
  return (
    <Paper className={classes.first}>
      <Grid item xs={12}>
        <h1 className={classes.fonts}>{fan}°C</h1>
      </Grid>
      <Grid item xs={12} className={classes.center}>
        <Switch
          checked={ac}
          onChange={handleAC}
          color="primary"
          name="checkedAC"
          inputProps={{
            "aria-label": "primary checkbox",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {ac ? (
          <Slider
            defaultValue={24}
            aria-labelledby="discrete-slider-always"
            step={1}
            marks={marks}
            valueLabelDisplay="auto"
            min={16}
            max={30}
            value={fan}
            onChange={updateTemp}
          />
        ) : (
          <Slider
            defaultValue={24}
            aria-labelledby="discrete-slider-always"
            step={1}
            marks={marks}
            valueLabelDisplay="auto"
            min={16}
            max={30}
            value={fan}
            onChange={updateTemp}
            disabled
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <br />
        {ac ? (
          <ButtonGroup
            size="medium"
            color="primary"
            aria-label="large outlined primary button group"
          >
            <Button>Auto</Button>
            <Button>Low</Button>
            <Button>Mid</Button>
            <Button>High</Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup
            size="medium"
            color="primary"
            aria-label="large outlined primary button group"
            disabled
          >
            <Button>Auto</Button>
            <Button>Low</Button>
            <Button>Mid</Button>
            <Button>High</Button>
          </ButtonGroup>
        )}
      </Grid>
      <br />
      <Grid item xs={12} container direction="row">
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mode}
              onChange={updateMode}
            >
              <MenuItem value={"Auto"}>Auto</MenuItem>
              <MenuItem value={"Heat"}>Heat</MenuItem>
              <MenuItem value={"Dry"}>Dry</MenuItem>
              <MenuItem value={"Cool"}>Cool</MenuItem>
              <MenuItem value={"Fan"}>Fan</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Swingmode</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={swing}
              onChange={updateSwing}
            >
              <MenuItem value={"Auto"}>Auto</MenuItem>
              <MenuItem value={"Up"}>Up</MenuItem>
              <MenuItem value={"Middle"}>Middle</MenuItem>
              <MenuItem value={"Down"}>Down</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.fab}></Grid>
      </Grid>
    </Paper>
  );
};

export { AcCard };
