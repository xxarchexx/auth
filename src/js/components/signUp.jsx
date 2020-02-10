import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { spacing } from "@material-ui/system";
import MessageForm from "./generalComponents/MessageForm";

const headermessage =
  "Попробуйте войти или зарегестрироваться заново, данный емайл уже принадлежит другому аккаунту";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        move-to-free.ru
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.existAccount = false;

    this.data = {
      confirmPassword: "",
      password: "",
      email: "",
      firstname: "",
      lastname: "",
      login: ""
    };

    this.state = {
      email: "",

      firstnameHelper: "",
      lastnameHelper: "",
      emailHelper: "",
      loginHelper: "",
      confirmPasswordHelper: "",
      passwordHelper: "",

      loginError: false,
      firstnameError: false,
      lastnameError: false,
      confirmPasswordError: false,
      emailError: false,
      passwordError: false,

      messageFormOpen: false
    };
  }

  /**
   * @param {Event} e
   */
  onChange = e => {
    const { name, value } = e.target;
    this.data[name] = value;
  };

  _onSubmit = e => {
    e.preventDefault();
    const hasError = this.validate();
    if (hasError) return;
    this.props.sign_up({ ...this.data, email: this.state.email });
  };

  validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validate = hasError => {
    hasError = false;
    if (this.data.password !== this.data.confirmPassword) {
      hasError = true;
      this.confirmPaswordRef.focus();
      this.setState({
        confirmPasswordHelper: "Пароль не совпадает",
        confirmPasswordError: true
      });
    } else if (this.state.confirmPasswordError) {
      this.setState({
        confirmPasswordHelper: "",
        firstnameError: false
      });
    }

    if (this.data.password.length < 5) {
      hasError = true;
      this.setState({
        passwordHelper: "Пароль должен быть не менее 5 символов",
        passwordError: true
      });
    } else if (this.state.passwordError) {
      this.setState({
        passwordHelper: "",
        passwordError: false
      });
    }

    const emailValid = this.validateEmail(this.state.email);

    if (!emailValid) {
      hasError = true;
      this.setState({
        emailHelper: "Email имеет не верный формат",
        emailError: true
      });
    } else if (this.state.emailError) {
      this.setState({
        emailHelper: "",
        emailError: false
      });
    }

    if (this.data.firstname.toString().length < 2) {
      hasError = true;
      this.setState({
        firstnameHelper: "Имя должно быть не менее 3х символов",
        firstnameError: true
      });
    } else if (this.state.firstnameError) {
      this.setState({
        firstnameHelper: "",
        firstnameError: false
      });
    }

    if (this.data.lastname.toString().length < 2) {
      hasError = true;
      this.setState({
        lastnameHelper: "Фамилия должна быть не менее  3х символов",
        lastnameError: true
      });
    } else if (this.state.lastnameError) {
      this.setState({
        lastnameHelper: "",
        lastnameError: false
      });
    }

    if (this.data.login == "") {
      hasError = true;
      this.setState({
        loginHelper: "Будет взят email в качестве логина",
        loginError: false
      });
    } else if (this.data.login.toString().length < 5) {
      hasError = true;
      this.setState({
        loginHelper: "Логин должнен быть не менее  5х символов",
        loginError: true
      });
    } else if (this.state.loginError) {
      this.setState({
        loginError: false,
        loginHelper: ""
      });
    }

    return hasError;
  };

  closeDialog = () => {
    this.props.hide_exist_form();
    this.emailInput.error = true;
    this.emailInput.value = "";
    this.data.email = "";
    this.setState({ email: "" });
  };

  openDialog = () => {
    this.existAccount = false;
  };

  componentDidMount() {
    if (this.existAccount == true) {
      this.setState({ messageFormOpen: true });
    }
  }

  emailchanged = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { classes, payload } = this.props;
    
    if (typeof payload.needredirect !== "undefined" && payload.needredirect === true) {
      return (window.location.href = "/redirect");
    }

    if (typeof payload.open !== "undefined") {
      this.existAccount = payload.open;
    }

    return (
      <Container component="main" maxWidth="xs">
        <MessageForm
          closeDialog={this.closeDialog.bind(this)}
          open={this.existAccount}
          headermessage={headermessage}
        />

        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstname"
                  variant="outlined"
                  required
                  fullWidth
                  // onBlur={this.onChange.bind(this)}
                  id="firstname"
                  innerRef={el => (this.firstnameRef = el)}
                  helperText={this.state.firstnameHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.firstnameError}
                  label="Имя"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  helperText={this.state.lastnameHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.lastnameError}
                  fullWidth
                  id="lastname"
                  label="Фамилия"
                  name="lastname"
                  autoComplete="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  onChange={this.emailchanged.bind(this)}
                  value={this.state.email}
                  helperText={this.state.emailHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.emailError}
                  id="email"
                  innerRef={el => (this.emailInput = el)}
                  label="Почта email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="login"
                  helperText={this.state.loginHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.loginError}
                  label="Логин"
                  name="login"
                  autoComplete="login"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  helperText={this.state.passwordHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.passwordError}
                  name="password"
                  label="пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  helperText={this.state.confirmPasswordHelper}
                  onBlur={this.onChange.bind(this)}
                  error={this.state.confirmPasswordError}
                  innerRef={el => (this.confirmPaswordRef = el)}
                  name="confirmPassword"
                  label="Повторите пароль"
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}

            <Button
              onClick={this._onSubmit.bind(this)}
              type="submin"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Зарегестрироваться
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  У вас уже есть аккаунт? Войти
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default SignUp;
