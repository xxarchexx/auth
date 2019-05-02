import React from 'react';
import { Redirect } from 'react-router'
import validateInput from '../../shared/validations/signup';
import TextFieldGroup from '../common/TextFieldGroup';
import PropTypes from 'prop-types';
import  axios from 'axios';
// import {
//   withRouter
// } from 'react-router-dom'

class SignupForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      timezone: '',
      errors: {},
      isLoading: false,
      invalid: false,
      redirect: false,
    }
    this.redirectUrl = ""
    this.formClass = "active"
    
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  checkUserExists(e) { 
       return    
    }
  

  onSubmit(e) {
    e.preventDefault();     
      this.props.userSignupRequest(this.state) 
      this.setState({ redirect: this.props.needRedirect })     
    }

  render() {   
   
    const { errors } = this.state;
    if(this.state.redirect === true){
      return (<div><Redirect to={this.props.redirectURL} /></div>)
    }

    // const options = map(timezones, (val, key) =>
    //   <option key={val} value={val}>{key}</option>
    // );
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
      <form onSubmit={this.onSubmit} >
        <h1>Join our community!</h1>

        <TextFieldGroup
          error={errors.username}
          label="Username"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.username}
          field="username"
        />

        <TextFieldGroup
          error={errors.email}
          label="Email"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.email}
          field="email"
        />

        <TextFieldGroup
          error={errors.password}
          label="Password"
          onChange={this.onChange}
          value={this.state.password}
          field="password"
          type="password"
        />

        <TextFieldGroup
          error={errors.passwordConfirmation}
          label="Password Confirmation"
          onChange={this.onChange}
          value={this.state.passwordConfirmation}
          field="passwordConfirmation"
          type="password"
        />

        <div className="form-group">
          <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">
            Sign up
          </button>
        </div>
      </form>
      </div>
      </div>
    );
  }
}

export default SignupForm;
