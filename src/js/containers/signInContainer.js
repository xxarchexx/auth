import { connect } from "react-redux";
import SignIn from "../components/signIn";
import { userSignupRequest, signIn } from "../actions";

const mapDispatchToProps = dispatch => {
  return {
    sign_in: (login, password) => {
      dispatch(signIn(login, password));
    }
  };
};

const mapStateToProps = state =>  {
  const { success : success } = state.Users;
  return {success}
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
