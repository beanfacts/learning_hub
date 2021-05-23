import { makeStyles, withStyles } from "@material-ui/core/styles";
import Clock from "./Clock";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Dialog,
  Input,
  Box,
  IconButton,
  Typography,
  Grid,
} from "@material-ui/core";
import { AcCard } from "./AcCard";
import { VdoCard } from "./VdoCard";
import { LightCard } from "./LightCard";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Remote from "@material-ui/icons/SettingsRemoteRounded";

const head = {
  headers: {'sessid': sessionStorage.getItem("sessid")}
}

const StyledButton = withStyles({
  root: {
    background: "#3f51b5",
    borderRadius: 6,
    border: 0,
    color: "white",
    height: 60,
    padding: "0 40px",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
    margin: "12px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: 20,
  },
})(Button);

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  left: {
    textAlign: "left",
    color: "#a3a5a9",
  },
  center: {
    textAlign: "center",
    color: "#a3a5a9",
  },
  right: {
    textAlign: "right",
    padding: theme.spacing(2),
    color: "#a3a5a9",
  },
  round: {
    borderRadius: 50,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  resultAlign: {
    align: "left",
    display: "flex",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    flexGrow: "1",
    padding: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.3)",
  },
  selectedValueDisplay: {
    align: "left",
    borderRadius: 5,
    padding: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
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
  const [room, setRoom] = useState(["None"]);
  const [roomName, setRoomName] = useState(["None"]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedroom, setSelectedroom] = useState(false);
  const classes = useStyles();
  
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const updateRoom = (event) => {
    setRoom(event.target.value[0]);
    setRoomName(event.target.value[1]);
    console.log(event.target.value[1]);
    setSelectedroom(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [hm, setHm] = useState([]);
  useEffect(() => {
    //axios function
    async function fetchdata() {
      // TODO change to actual path
      const request = await axios.get("/rooms",head);
      setHm(request.data.result);
      setLoading(true);
      return request;
    }
    fetchdata().then(
      (response) => {
        // console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  let newRoom = null;
  /* 
  TODO: change the room id to room name and when pass in
  the value use the room id!!
  */
  const room_n = hm.map(k => k.room_name);
  const room_i = hm.map(k => k.room_id);

  // console.log("name", room_n);
  // console.log("id", room_i);

  const zip = (a,b) => a.map((k,i)=>[k,b[i]]);
  const room_tup = zip(room_i,room_n);
  // console.log(room_tup);

  let key = [];
  let val = [];


  newRoom = room_tup.map((value, index) => {
    // console.log(value)
    return <MenuItem onClick={handleClose} value={value}>{value[1]}</MenuItem>;
  });
  // console.log(newRoom)
  return (
    <>
      {loading ? (
        <Grid container>
          <Grid item>
            <h1 className={classes.left} margin={2}>
              <Clock />
            </h1>
          </Grid>
          <Grid item className={classes.resultAlign}>
            <div className={classes.selectedValueDisplay}>
              <Box
                component="div"
                display="inline"
                p={1}
                m={1}
                bgcolor="white"
                className={classes.selectedValueDisplay}
              >
                {roomName}
              </Box>
            </div>
          </Grid>
          <Grid item>
            <StyledButton onClick={handleClickOpen} className={classes.round}>
              Select Building & Room
            </StyledButton>
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>Select Room to schedule</DialogTitle>
              <DialogContent dividers>
                <form className={classes.container}>
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
                        {newRoom}
                      </Select>
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
          </Grid>
          <Grid item>
            <IconButton
              disabled={selectedroom ? false : true}
              onClick={handleClickOpen2}
              color="primary"
            >
              <Remote style={{ fontSize: 55 }} />
            </IconButton>
            <Dialog
              onClose={handleClose2}
              open={open2}
              maxWidth="lg"
              fullWidth={true}
              onBackdropClick={handleClose2}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose2}>
                Controller
              </DialogTitle>
              <DialogContent dividers>
                <Grid item xs={12} container direction="row">
                  {/* <Grid item xs={2}></Grid> */}
                  <Grid item xs={4}>
                    <VdoCard />
                  </Grid>
                  <Grid item xs={4}>
                    <LightCard room={room} />
                    {/* TODO change the "hm_602" to dynamic value (the value that you stored) */}
                  </Grid>
                  <Grid item xs={4}>
                    <AcCard room={room} />
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
          </Grid>
        </Grid>
      ) : (
        <div className={classes.center}>
          <CircularProgress></CircularProgress>
        </div>
      )}
    </>
  );
};

export { Topbar };
