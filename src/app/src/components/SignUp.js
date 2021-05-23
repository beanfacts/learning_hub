import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/beanfacts/learning_hub">
        learning-hub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8), 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  StyledStepper : {
    backgroundColor : '#FAFAFA',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(5), //space for the tab
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));


export default function SignUp() {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [ConpassWord, setConPassWord] = useState('');
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0)
  const  nextStep= () =>{
    if (activeStep < 3 && 
      firstName && lastName && email && userName && passWord === ConpassWord

      ){
      setActiveStep((currentStep) => currentStep +1) //increasing the step
    }
    if (ConpassWord !== passWord){
      alert('your password is not match')
    }

   
  }
  // console.log({firstName})
  


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <AccountCircleIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div>
        <Stepper activeStep={activeStep} className = {classes.StyledStepper}>
          <Step>
            <StepLabel>Signup</StepLabel>
          </Step>
          <Step>
            <StepLabel>Fingerprint</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>
        </div>


        <form className={classes.form}  >
          {
            (activeStep === 0) ? ///////////////first step and make it dissappear
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e => setFirstName(e.target.value)}
                
                
              />
            </Grid>
            {/* <h3>{firstName}</h3> */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}h
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={e => setUserName(e.target.value)}
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
                id="password"
                autoComplete="current-password"
                onChange={e => setPassWord(e.target.value)}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="Conpass"
                type="password"
                label="Confirm Password"
                name="Conpass"
                autoComplete="Conpass"
                onChange={e => setConPassWord(e.target.value)}
              />
            </Grid>
            <Button
            type = "submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick = {() => nextStep()}
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
          : <div></div>
          }
          {
            (activeStep === 1) ? ///////////////register step
            <div>
            <Typography className={classes.instructions}>
              please press the button
            </Typography>

            <Button
            type = "submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick = {() => nextStep()}
          >
            RegisterFinger
          </Button>
          </div>
          : <div></div>
          }
          {
            (activeStep === 2) ? //////////////complete
            <div>
              <Typography className={classes.instructions}>
              All steps are completed
            </Typography>
            
            <Button
            type = "submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick = {() => setActiveStep(0)}
          >
            DONE
          </Button>
          </div>
          : <div></div>
          }


        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}