import React, { Component } from "react";
import { render } from "react-dom";
import {Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent, CardActions,Paper, IconButton, SvgIcon, Icon } from "@material-ui/core";
import { Facebook, Google } from "@material-ui/icons";
import google from '@/icons/google.svg';
import  '@/styles/css/test.scss';
import ResponsiveCard from "./generalComponents/CardGrid/ResponsiveCard";
import ResponsiveContainerGrid from "./generalComponents/CardGrid/ResponsiveContainerGrid";
import axios from 'axios';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.state = {
      location: "",
      login: { value: null, error: false, helperText: null },
      password: { value: null, error: false, helperText: null }
    };
  }

  facebookLogin=()=>{
    console.log('facebook login')
    axios.get('/facebooklogin').then((res)=>{
      console.log(res.data.Url)
      window.location.replace(res.data.Url)
    })
  }

  googleLogin=()=>{
    console.log('google login')
  }


  signIn(e) {
    if (this.loginInput.value === "") {
      this.setState({
        email: {
          value: this.loginInput.value,
          error: true,
          helperText: "Your login must be specified."
        }
      });
      this.loginInput.focus();
    }

    e.preventDefault();
    this.props.SignIn(this.loginInput.value, this.passwordInput.value);
  }

  render() {
  
    return (
      <div>
        <ResponsiveContainerGrid>
          <Grid item xs={12} sm={6}>
            <ResponsiveCard>
              <form onSubmit={this.signIn.bind(this)}>
                <CardHeader title="Sign in" subheader="to continue to TPWC" />
                <CardContent>
                  <TextField
                    label="Enter your email"
                    fullWidth
                    autoFocus
                    required
                    inputRef={input => (this.loginInput = input)}
                    error={this.state.login.error}
                    helperText={this.state.login.helperText}
                  />
                  <TextField
                    label="Enter your password"
                    fullWidth
                    required
                    type="password"
                    inputRef={input => (this.passwordInput = input)}
                  />
                </CardContent>
                <CardActions  p={1} style={{ justifyContent: "space-between" }}>
                  <Button variant="outlined">Forgot password</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Sign in
                  </Button>

                  <Link to="/signup">
                    <Button variant="contained" color="default">
                      Sign Up
                    </Button>                  
                  </Link>
                </CardActions>
              </form>
            </ResponsiveCard>
            <ResponsiveCard>
                <div>
                <CardHeader title="" subheader="" />
                  <Paper>
                    <IconButton onClick={this.facebookLogin} m={1}>
                        <Facebook/>
                    </IconButton>
                    <IconButton onClick={this.googleLogin}  m={1}>
                      <GoogleIcon />
                    </IconButton>
                  </Paper>
                 </div>
            </ResponsiveCard>  
          </Grid>
        </ResponsiveContainerGrid>        
      </div>
    );
  }
}


const GoogleIcon = props =>{
  return (<Icon  {...props}>
     <img src={google}  />
</Icon>)
}