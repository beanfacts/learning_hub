import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import axios from "../axios";
import { Email } from "@material-ui/icons";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/beanfacts/learning_hub">
        learning-hub
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  StyledStepper: {
    backgroundColor: "#fafafa",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5), //space for the tab
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailformat, setEmailformat] = useState(false);
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [ConpassWord, setConPassWord] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [checkerrors, setCheckErrors] = useState("");
  const [checkerrorsemail, setCheckErrorsemail] = useState("");
  const [showError, setshowError] = useState(false);
  const [verifypin, setVerifypin] = useState("");

  const nextStep = () => {
    if (
      activeStep < 3 &&
      firstName &&
      lastName &&
      email &&
      userName &&
      !emailformat &&
      passWord === ConpassWord
    ) {
      const body = {
        username: userName,
        password: passWord,
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
      axios
        .post(`/signup`, body)
        .then(() => {
          setActiveStep((currentStep) => currentStep + 1);
        })
        .catch((err) => {
          console.log(err);
          setOpen(true);
        });
    } else {
      setOpen(true);
    }
  };

  const handlepin = () => {
    const temp = {
      username: userName,
      verif_code: verifypin,
    };
    axios
      .post(`/signup_verify?username=${userName}&verif_code=${verifypin}`)
      .then(() => {
        setActiveStep((currentStep) => currentStep + 1);
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const checkpass = () => {
    if (ConpassWord === passWord) {
      setshowError(false);
      setCheckErrors("");
    } else {
      setshowError(true);
      setCheckErrors("miss match");
    }
  };
  const validemail = () => {
    const reg = /$|.+@kmitl\.ac\.th+/;
    if (email === "") {
      return;
    }
    if (/.+@kmitl\.ac\.th+/.test(email)) {
      setEmailformat(false);
      setCheckErrorsemail("");
    } else {
      setEmailformat(true);
      setCheckErrorsemail("Please enter valid email 'example.ex@kmitl.ac.th'");
    }
    console.log(reg.test(email));
  };
  useEffect(() => {
    validemail();
  }, [email, emailformat]);
  useEffect(() => {
    checkpass();
  }, [ConpassWord, passWord]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please fill in valid information
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Stepper activeStep={activeStep} className={classes.StyledStepper}>
          <Step>
            <StepLabel>Signup</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirm Email</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>
        <form className={classes.form}>
          {activeStep === 0 ? ( ///////////////first step and make it dissappear
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              {/* <h3>{passWord}</h3> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={emailformat}
                  helperText={checkerrorsemail}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validemail();
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPassWord(e.target.value);
                    checkpass();
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  name="Conpass"
                  autoComplete="Conpass"
                  error={showError}
                  helperText={checkerrors}
                  onChange={(e) => {
                    setConPassWord(e.target.value);
                    checkpass();
                  }}
                />
              </Grid>
              <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => nextStep()}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <div></div>
          )}
          {activeStep === 1 ? ( ///////////////register step
            <div>
              <Typography className={classes.instructions}>
                Verification code will be sent to your account in 30 seconds
              </Typography>
              <TextField
                label="Verifiy Code"
                name="verif_code"
                inputProps={{
                  maxlength: 6,
                }}
                onChange={(e) => setVerifypin(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => handlepin()}
              >
                Verify
              </Button>
            </div>
          ) : (
            <div></div>
          )}
          {activeStep === 2 ? ( //////////////complete
            <div>
              <Typography className={classes.instructions}>
                🥳 All steps are completed 🎉
              </Typography>

              <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href="/signin"
                // onClick={() => setActiveStep(0)}
              >
                DONE
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
