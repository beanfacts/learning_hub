import React from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Schedule from "./pages/Schedule";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";
import { Redirect } from "react-router-dom";
import CustomRoute from "./components/CustomRoute";

export default function AutoGrid() {
  console.log(sessionStorage.getItem("sessid"));
  // const [permit, setPermit] = useState(false);
  // if (sessionStorage.getItem("sessid")!==null){
  //   setPermit(true)
  return (
    <>
      <Router>
        <div className="App">
          <Navigation />
          <Switch>
            <Route exact path="/">
              <Redirect to="/signin" />
            </Route>
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <CustomRoute path="/schedule" component={Schedule} />
            <Route path="/forgetpassword" component={ForgetPassword} />
          </Switch>
        </div>
      </Router>
    </>
  );
}
