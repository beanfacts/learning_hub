import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Navigation from "./components/Navigation";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Schedule from "./pages/Schedule";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";


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
