import React, { Component } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {
  CardHeader,
  CardContent,
  CardActions,
  Paper,
  IconButton,  
  Icon
} from "@material-ui/core";
import { Facebook, Google } from "@material-ui/icons";
import google from "@/icons/google.svg";
import "@/styles/css/test.scss";
import ResponsiveCard from "./generalComponents/CardGrid/ResponsiveCard";
import ResponsiveContainerGrid from "./generalComponents/CardGrid/ResponsiveContainerGrid";
import axios from "axios";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.data = {
      loginHelper: "Введите логин или email",
      passwordHelper: "Введите пароль"
    };

    this.state = {
      errors: {
        loginError: "",
        password: ""
      }
    };
  }

   login = () => {
    const hasError = this.validate();
    this.props.sign_in(this.loginInput.value, this.passwordInput.value);
  };

  validate = (haserror) => {
    let t = this.loginInput.value;
    let hasError = false;
    const newState = { ...this.state.errors };
    // Object.assign({},this.state.errors)

    if (this.loginInput.value.length < 4) {
      newState.login = "логин должен быть не менее 5х символов";
      hasError = true;
    }

    if (this.passwordInput.value.length < 4) {
      newState.login = "пароль должен быть не менее 5х символов";
      hasError = true;
    }

    if (hasError) this.setState({ newState });
    return hasError;
  };


  facebookLogin = () => {
    console.log("facebook login");
    axios.get("/facebooklogin").then(res => {     
      window.location.replace(res.data.Url);
    });
  };

  googleLogin = () => {
    console.log("google login");
  };

  signIn(e) {
    if (this.loginInput.value === "") {
      this.setState({
        email: {
          value: this.loginInput.value,
          error: true,
          helperText: "Введите ваш логин"
        }
      });
      this.loginInput.focus();
    }

    e.preventDefault();
    this.props.SignIn(this.loginInput.value, this.passwordInput.value);
  }

  render() {
    const {loggined, success} = this.props;
    if (success){
       return ( window.location.href ="/redirect")
    }

    return (
      <div >
        <ResponsiveContainerGrid style={{ justifyContent: "space-evently" }}>
          <Grid item xs={12} sm={6}>
            <ResponsiveCard>
              <form>
                <CardHeader title="Войти" subheader="Спасибо что используйте наш сервис" />
                <CardContent>
                  <TextField                  
                    name="login"
                    fullWidth
                    autoFocus
                    required
                    inputRef={input => (this.loginInput = input)}
                    error={this.state.errors.login}
                    helperText={this.data.loginHelper}
                  />
                  <TextField                    
                    name="password"
                    fullWidth
                    required
                    helperText={this.data.passwordHelper}
                    error={this.state.errors.password}
                    type="password"
                    inputRef={input => (this.passwordInput = input)}
                  />
                </CardContent>
                <CardActions  style={{ justifyContent: "center" }}>
                  <Button variant="outlined">Forgot password</Button>
                  <Button
                     onClick={this.login.bind(this)}
                    type="button"
                    variant="contained"
                    color="primary"
                  >
                   Войти
                  </Button>

                  <Link to="/signup">
                    <Button variant="contained" color="default">
                     Зарегестрироваться
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
                    <Facebook />
                  </IconButton>
                  {/* <IconButton onClick={this.googleLogin}  m={1}>
                      <GoogleIcon />
                    </IconButton> */}
                </Paper>
              </div>
            </ResponsiveCard>
          </Grid>
        </ResponsiveContainerGrid>
      </div>
    );
  }
}

const GoogleIcon = props => {
  return (
    <Icon {...props}>
      <img src={google} />
    </Icon>
  );
};
