import react from 'react'
import {connect} from 'react-redux'
import SignUpForm from '../components/SignUpForm'
import  {signUp, ifUserExists } from '../actions/index'


const mapDispatchToProps = (dispatch)=>{
    return   {
        userSignupRequest: signUp,
        isUserExists: ifUserExists
    }
}

connect(null, mapDispatchToProps)(SignUpForm)