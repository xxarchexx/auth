import { connect } from "react-redux";
import SignUp from "../components/signUp";
import { userSignupRequest,showMessageForm,hideMessageForm } from "../actions";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },

  input: {
    margin: theme.spacing(1)
  },

  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

const mapDispatchToProps = dispatch => {
  return {
    sign_up: data => {
      dispatch(userSignupRequest(data));
    },

    // show_exist_form: () => {
    //   dispatch(showMessageForm());
    // },

    hide_exist_form: () => {
      dispatch(hideMessageForm());
    }
  };
};

const mapStateToProps = state => {
  const { success, payload } = state.Users;
  return { success, payload };
};

export default compose(
  withStyles(styles, {
    name: "SignUp"
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(SignUp);
