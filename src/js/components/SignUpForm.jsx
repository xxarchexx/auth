import React, {Component} from 'react';
import validateInput from '../helpers/validator';
import TextFieldGroup from './TextFieldGroup';
import map from 'lodash/map';

class SignUpForm extends Component{
  constructor(props){
    super(props)

    this.state = {
      username ='',
      email='',
      password:'',
      errors:'',
      passwordConfirm='',
      isLoading = false,
      ivalid:false  
      }

    this.onChange = this.onChange.bind(this);
    this.checkUserExixts = this.checkUserExixsts.bind(this);
  }

/**
 * 
 * @param {Event} e 
 */
  onSubmit(e){
  e.preventDefault();
  if(this.isValid()){
    this.setState({errors:{},isLoading:true});
    
    this.props.userSignupRequest(this.state).then(
      () => {
        this.componentWillReceiveProps.addFlashMessage({
          type:'success',
          text:'you signed up successfully. Welcome!'
        });
        this.context.router.push('/');
      },
        (err) => this.setState({ errors: err.response.data, isLoading: false })
        );
      }
    }
  

  onChange(e){
    this.setState({[e.target.name] : e.target.value});
  }

  isValid(){
    const { errors, isValid} = validateInput(this.state)

    if(!isValid)
    this.setState({errors})
    return isValid;
  }

  checkUserExists(e){
    const field = e.target.name;
    const val = e.target.value;

    if(val !==''){
      this.props.isUserExists(val).then(
        res=>{
          let errors = this.state.errors;
          let invalid;
          if(res.data.user){
            errors[field] = 'There is userwith such'+field;
            invalid = true;
          }else{
            errors[field]='';
            invalid = false;
          }

          this.setState({errors,invalid});
        }
      )
    }
  }

  render() {
    const { errors } = this.state;
   
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Join our community!</h1>

      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired, 
  isUserExists: React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SignupForm;
