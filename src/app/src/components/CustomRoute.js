import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

class CustomRoute extends Component {
  hasPermission() {
    if (sessionStorage.getItem("sessid") === "null") {
      console.log("No Permission");
      return false;
    } else {
      console.log("Permission exists");
      return true;
    }
  }

  render() {
    const { component, path } = this.props;

    if (this.hasPermission())
      return <Route path={path} component={component} />;
    else {
      return (
        <Route exact path="/schedule">
          <Redirect from="/schedule" to="/signin" />
        </Route>
      );
    }
  }
}

export default CustomRoute;
