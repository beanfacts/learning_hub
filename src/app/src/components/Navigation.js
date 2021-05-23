import React from "react";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from '@material-ui/core/Toolbar';
import { Button, Typography,Grid } from "@material-ui/core";
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import Link from '@material-ui/core/Link';
import { makeStyles , withStyles} from '@material-ui/core/styles';
import axios from "../axios";
import { useEffect, useState } from "react";



const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 40,
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  },
  fixedWidthContainer: {
    width: '240px',
  },
  titleSpacing: {
    marginRight: theme.spacing(2),
  },
}));


const handleLogout = ()=>{
  const head = {
    headers: { sessid: sessionStorage.getItem("sessid") },
};
  console.log(head)
  axios
    .post(`/logout`, sessionStorage.getItem("sessid"),head)
    .then(response=>{
      console.log(response.data.result);
      const id = sessionStorage.getItem("sessid")
      sessionStorage.removeItem("sessid")
      if(response.data.result!=null){
        window.location.href="/signin"
        console.log(id, "is Logged Out")
      }
    })
    
    //.then(window.location.href="/signin")
}


const handlePath = () => {
  console.log("path", window.location.pathname);
  console.log("href", window.location.href);
}

const StyledButton = withStyles({
  root: {
    background: "#3f51b5",
    borderRadius: 6,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 40px",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
    margin: "12px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: 20,
  },
})(Button);

function Navigation() {
  const classes = useStyles();
  const [allow, setAllow] = useState(true);

  const protectComponent = () =>{
    if(window.location.pathname!="/signin"){
      return (
        <Grid xs={2} item className={classes.fixedWidthContainer}>
            <ul>
              <StyledButton
                onClick={handleLogout}>
                  Logout
              </StyledButton>
            </ul>
        </Grid>
      )
    }
  }

  useEffect(() => {
    protectComponent();
  }, []);
  console.log(window.location.pathname)
  return (
    
    <nav>
      <Grid container className={classes.root}>
        <Grid xs={8} style={{flexGrow: "1"}} className={classes.fixedWidthContainer}>
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
        <Grid xs={2} item className={classes.fixedWidthContainer}>
          <ul>
            <StyledButton
              onClick={handlePath}>
                Check Path
            </StyledButton>
          </ul>
        </Grid>
        {/* {allow?(
          <Grid xs={2} item className={classes.fixedWidthContainer}>
            <ul>
              <StyledButton
                onClick={handleLogout}>
                  Logout
              </StyledButton>
            </ul>
          </Grid>
        ): setAllow(true)} */}
        {protectComponent()}
      </Grid>
      
    </nav>
  );
}

export default Navigation;
