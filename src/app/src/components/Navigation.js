import React from "react";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from "@material-ui/core";
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import Link from '@material-ui/core/Link';

function Navigation() {
  return (
    <nav>
      <ul className="nav-header">
        <li>
          <Typography variant="h6" style={{ align: "left", flex: 1 }}>
            SMART CLASSROOM
          </Typography>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
