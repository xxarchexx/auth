import React from 'react';
import SignupForm from './SignupForm';
import { connect } from 'react-redux';
import { userSignupRequest } from '../../actions/signupActions';
import PropTypes from 'prop-types';
import { Router, withRouter } from 'react-router-dom'


function mapStateToProps(state){
  return {  
    redirectURL: typeof(state.rootRedicer.payload) !== 'undefined' ? state.rootRedicer.payload  : null,
    needRedirect:state.rootRedicer.redirect
  }
}  

const mapDispatchToProps = dispatch => {
  return {
    // dispatching actions returned by action creators
    userSignupRequest : (data) => dispatch(userSignupRequest(data)) 
  }
}

const SignupPage = connect(mapStateToProps, mapDispatchToProps)(withRouter(SignupForm));
export default SignupPage;
