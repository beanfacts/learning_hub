import React from "react";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from '@material-ui/core/Toolbar';
import {
  Button,
  Typography,
  Grid,
  Dialog,
  FormControl,
} from "@material-ui/core";
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import Link from '@material-ui/core/Link';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Logoutico from "@material-ui/icons/ExitToAppRounded";
import axios from "../axios";
import { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 40,
    alignItems: "center",
    padding: theme.spacing(0, 2),
  },
  titleSpacing: {
    marginRight: theme.spacing(2),
  },
}));

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

const head = {
  headers: { sessid: sessionStorage.getItem("sessid") },
};

const handleLogout = () => {
  console.log(head);
  axios
    .post(`/logout`, sessionStorage.getItem("sessid"), head)
    .then((response) => {
      console.log(response.data.result);
      const id = sessionStorage.getItem("sessid");
      sessionStorage.removeItem("sessid");
      if (response.data.result != null) {
        window.location.href = "/signin";
        console.log(id, "is Logged Out");
      }
    })
    .catch((e) => {
      // clear session ID
      sessionStorage.removeItem("sessid");
      window.location.href = "/signin";
    });
};

const handlePurgeLogout = () => {
  axios
    .post(`/purge_sessions`, sessionStorage.getItem("sessid"), head)
    .then((response) => {
      console.log(response.data.result);
      const id = sessionStorage.getItem("sessid");
      // sessionStorage.removeItem("sessid");
      if (response.data.result != null) {
        sessionStorage.removeItem("sessid");
        window.location.href = "/signin";
        console.log(id, "Just Purged Everyone");
      }
    })
    .catch((e) => {
      // redirect to sigin
      sessionStorage.removeItem("sessid");
      window.location.href = "/signin";
    });
};

const StyledButton = withStyles({
  root: {
    background: "#3f51b5",
    borderRadius: 6,
    border: 0,
    color: "white",
    height: 60,
    width: 350,
    padding: "0 40px",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
    margin: "12px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: 20,
  },
})(Button);

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

function Navigation() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const protectComponent = () => {
    if (window.location.pathname !== "/signin") {
      return (
        <Grid item>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={handleClickOpen}
          >
            <Logoutico style={{ color: "white", fontSize: 30 }} />
          </IconButton>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Test Logout Dialog</DialogTitle>
            <DialogContent dividers>
              <form className={classes.container}>
                <div>
                  <StyledButton onClick={handleLogout}>Logout</StyledButton>
                </div>
                <br />
                <div>
                  <StyledButton onClick={handlePurgeLogout}>
                    Logout from all devices
                  </StyledButton>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      );
    }
  };

  const logOutWhenNoSessID = () => {
    if (
      sessionStorage.getItem("sessid") === null ||
      sessionStorage.getItem("sessid") === ""
    ) {
      window.location.href = "/signin";
      console.log("You have been logged out");
      sessionStorage.setItem("sessid", null);
    }
  };

  useEffect(() => {
    protectComponent();
  }, []);

  useEffect(() => {
    logOutWhenNoSessID();
  }, []);

  console.log(window.location.pathname);
  return (
    <nav>
      <Grid container className={classes.root}>
        <Grid style={{ flexGrow: "1" }} className={classes.fixedWidthContainer}>
          <ul className="nav-header">
            <li>
              <Typography
                variant="h6"
                className={classes.titleSpacing}
                component="span"
              >
                SMART CLASSROOM
              </Typography>
            </li>
          </ul>
        </Grid>
        {protectComponent()}
      </Grid>
    </nav>
  );
}

export default Navigation;
