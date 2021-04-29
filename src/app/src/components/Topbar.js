import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Clock from "./Clock";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { LightCard } from "./LightCard";
import { AcCard } from "./AcCard";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Paper from "@material-ui/core/Paper";
import VideoIcon from "@material-ui/icons/OndemandVideoRounded";
import ErrorIcon from "@material-ui/icons/ErrorOutlineRounded";

const StyledButton = withStyles({
  root: {
    background: '#3f51b5',
    borderRadius: 6,
    border: 0,
    color: 'white',
    height: 60,
    padding: '0 40px',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)',
    margin: '12px'
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 20,
  },
})(Button);

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

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
  resultAlign: {
    align: "left",
    fontSize: 20,
    fontWeight: "bold",
    padding: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.3)",
  },
  selectedValueDisplay:{
    align: "left",
    borderRadius: 6,
    minWidth: 200,
    padding: theme.spacing(2),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "90%",
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
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(10),
    // backgroundColor: 'skyblue',
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Topbar = () => {
  const [building, setBuilding] = useState(['None']);
  const [room, setRoom] = useState(['None']);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const classes = useStyles();
  const hmRoom = [505,604,706];
  const e12Room = [1,2,3];
  const eccRoom = [608,708];
  const videoConnected = true;

  let type = null;
  let options = null;

  if (building === "HM"){
    type = hmRoom;
  }else if(building === "E12"){
    type = e12Room;
  }else if(building === "ECC"){
    type = eccRoom;
  }

  if(type){
    options = type.map((el)=><MenuItem value={el}>{el}</MenuItem>);
  }
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const updateBuilding = (event) => {
    setBuilding(event.target.value);
    setRoom("")
  };

  const updateRoom = (event) => {
    setRoom(event.target.value);
  }

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
        <Grid zeroMinWidth={true}>
          <h1 className={classes.left} margin={2}>
            <Clock />
          </h1>
        </Grid>
        <Grid item xs={2} className={classes.resultAlign}>
          {/* <p className={classes.resultAlign0}>{building} {room}</p> */}
          <div className={classes.selectedValueDisplay}>
            <Box component="div" display="inline" p={1} m={1} bgcolor="white" className={classes.selectedValueDisplay}>
              {building}
              -
              {room}
            </Box>
            {/* <Box component="div" display="inline" p={1} m={1} bgcolor="white" className={classes.selectedValueDisplay}>
              {room}
            </Box> */}
          </div>
        </Grid>
        <Grid item xs={8}>
          <div align='right'>
            <StyledButton onClick={handleClickOpen}>Select Building & Room</StyledButton>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
              <DialogTitle>Select Building and Room to schedule</DialogTitle>
              <DialogContent dividers>
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
                      <option value={'HM'}>HM</option>
                      <option value={'ECC'}>ECC</option>
                      <option value={'E12'}>E12</option>
                    </Select>
                  </FormControl>
                  <div>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="room-select">Room</InputLabel>
                      <Select
                        labelId="room-select"
                        id="room-select"
                        value={room}
                        onChange={updateRoom}
                        input={<Input />}
                      >
                        {
                          options
                        }
                      </Select>
                      {building}
                      {room}
                    </FormControl>
                    </div>
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
      <Grid item xs={1}>
      <div>
      <StyledButton onClick={handleClickOpen2}>
        Controller
      </StyledButton>
      <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2} maxWidth='lg' fullWidth={true} onBackdropClick={handleClose2} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose2}>
          Controller
        </DialogTitle>
        <DialogContent dividers>
          <Grid item xs={12} container direction="row">
            {/* <Grid item xs={2}></Grid> */}
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
            <Grid item xs={4}>
              <LightCard/>
            </Grid>
            <Grid item xs={4}>
              <AcCard/>
            </Grid>
            {/* <Grid item xs={2}></Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose2} color="primary">
            Close
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
