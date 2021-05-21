import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Navigation from "./components/Navigation";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Schedule from "./components/Schedule";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgetPassword from "./components/ForgetPassword";


export default function AutoGrid() {
  return (
    <>
      <Router>
        <div className="App">
        <Navigation />
        <Switch>
          <Route path="/signin" component={SignIn}/>
          <Route path="/signup" component={SignUp}/>
          <Route path="/schedule" component={Schedule}/>
          <Route path="/forgetpassword" component={ForgetPassword}/>
        </Switch>
        </div>
      </Router>
      
    </>
  );
}
