import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import ResponsiveConstants from "./ResponsiveConstants";

const styleSheet = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down(ResponsiveConstants.mobileBreakpoint)]: {
      boxShadow: "0px 0px 0px 0px"
    },
    [theme.breakpoints.up(ResponsiveConstants.mobileBreakpoint)]: {
      "max-width": 500,  
    }
  }
}));

function ResponsiveCard(props) {
  const classes = props.classes;
  const { children } = props;
  return <Card className={classes.root}>{children}</Card>;
}

export default withStyles(styleSheet)(ResponsiveCard);
