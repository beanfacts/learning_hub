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
  Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { LightCard } from "./LightCard";
import { VdoCard } from "./VdoCard";
import { AcCard } from "./AcCard";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import SettingsRemoteRoundedIcon from "@material-ui/icons/SettingsRemoteRounded";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  textFieldStyle: {
    border: "1px light grey",
    borderRadius: theme.shape.borderRadius,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  resultAlign: {
    align: "left",
    fontSize: 20,
    fontWeight: "bold",
    padding: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.3)",
  },
  selectedValueDisplay: {
    align: "left",
    borderRadius: 6,
    minWidth: 200,
    padding: theme.spacing(2),
  },
  appBar: {
    position: "relative",
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
  const [building, setBuilding] = useState("None");
  const [room, setRoom] = useState(["None"]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const classes = useStyles();
  const hmVroom = ["HM-505", "HM-604", "HM-706"];
  const e12Room = [1, 2, 3];
  const eccRoom = [608, 708];

  let type = null;
  let options = null;

  if (building === "HM_601") {
    type = hmVroom;
  } else if (building === "E12") {
    type = e12Room;
  } else if (building === "ECC") {
    type = eccRoom;
  }

  if (type) {
    options = type.map((el) => <MenuItem value={el}>{el}</MenuItem>);
  }

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const updateRoom = (event) => {
    setRoom(event.target.value);
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
      const request = await axios.get("/rooms");
      console.log(request.data);
      setHm(request.data);
      console.log(hm.hm_602.name);
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
  let items = [];
  for (const [k, v] of Object.entries(hm)) {
    items.push(k);
  }
  newRoom = items.map((value, index) => {
    return <MenuItem value={value}>{value}</MenuItem>;
  });
  console.log({ newRoom });
  return (
    <Grid item xs={12}>
      <Grid item xs container>
        <Grid zeroMinWidth={true}>
          <h1 className={classes.left} margin={2}>
            <Clock />
          </h1>
        </Grid>
        <Grid item xs={2} className={classes.resultAlign}>
          <div className={classes.selectedValueDisplay}>
            <Box
              component="div"
              display="inline"
              bgcolor="white"
              className={classes.selectedValueDisplay}
            >
              {room}
            </Box>
          </div>
        </Grid>
        <Grid item xs={8}>
          <div align="right">
            <StyledButton onClick={handleClickOpen}>
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
          </div>
        </Grid>
        <Grid item xs={1}>
          <>
            <StyledButton onClick={handleClickOpen2}>Controller</StyledButton>
            <Dialog
              onClose={handleClose2}
              aria-labelledby="customized-dialog-title"
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
                  <Grid item xs={4}>
                    <VdoCard />
                  </Grid>
                  <Grid item xs={4}>
                    <LightCard room={room} />
                  </Grid>
                  <Grid item xs={4}>
                    <AcCard room={room} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose2} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Topbar };
