import {connect} from 'react-redux';
import SignUp from '../components/signUp'
import  {userSignupRequest } from '../actions'

const mapDispatchToProps=(dispatch)=>{
    return {       
        SignUp : (data) => {
            dispatch(userSignupRequest(data));
        }
    }
}


export default connect(null,mapDispatchToProps)(SignUp);

