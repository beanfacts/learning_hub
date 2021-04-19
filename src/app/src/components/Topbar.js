import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Clock from "./Clock";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 60,
    padding: '0 40px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 30,
  },
})(Button);

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  textFieldStyle: {
    border: "1px light grey",
    borderRadius: theme.shape.borderRadius
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const Topbar = () => {
  const [building, setBuilding] = React.useState([]);
  const [room, setRoom] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const classes = useStyles();
  

  const updateBuilding = (event) => {
    setBuilding(event.target.value);
  };

  const updateRoom = (event) => {
    setRoom(event.target.value);
  }

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <Grid item xs={8}>
          <div align='right'>
            <StyledButton onClick={handleClickOpen}>Schedule</StyledButton>
            {/* <Button onClick={handleClickOpen} className={classes.textFieldStyle}>Click to schedule</Button> */}
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
              <DialogTitle>Select Building and Room to schedule</DialogTitle>
              <DialogContent>
                <form className={classes.container}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="building-select">Building</InputLabel>
                    <Select
                      native
                      value={building}
                      onChange={updateBuilding}
                      input={<Input id="building-select" />}
                    >
                      <option aria-label="None" value="" />
                      <option value={10}>HM</option>
                      <option value={20}>ECC</option>
                      <option value={30}>E12</option>
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="room-select">Room</InputLabel>
                    <Select
                      labelId="room-select"
                      id="demo-dialog-select"
                      value={room}
                      onChange={updateRoom}
                      input={<Input />}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>HM-505</MenuItem>
                      <MenuItem value={20}>HM-604</MenuItem>
                      <MenuItem value={30}>HM-706</MenuItem>
                    </Select>
                  </FormControl>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Topbar };
