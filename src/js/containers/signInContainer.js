import {connect} from 'react-redux';
import SignIn from '../components/signIn'
import  {userSignupRequest, signIn } from '../actions'

const mapDispatchToProps=(dispatch)=>{
    return {       
        SignIn : (login, password) => {
            dispatch(signIn(login, password));
        }
    }
}


export default connect(null,mapDispatchToProps)(SignIn);

