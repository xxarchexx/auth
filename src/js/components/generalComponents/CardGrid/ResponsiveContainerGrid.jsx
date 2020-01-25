import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';

import ResponsiveConstants from "./ResponsiveConstants";

const styleSheet = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up(ResponsiveConstants.mobileBreakpoint)]: {
      "min-height": 500
    }
  }
}));

function ResponsiveContainerGrid(props) {
  const classes = props.classes;
  const { children } = props;
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justify="center"
      align="center"
    >
      {children}
    </Grid>
  );
}

export default withStyles(styleSheet)(ResponsiveContainerGrid);
