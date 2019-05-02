import React from 'react';
import LoginPage from '../components/login/LoginPage'
import { Link } from 'react-router-dom';

class LoginSignUpLinkPage extends React.Component{     
   render(){      
      return(
         <div>
        <LoginPage/>
        {this.props.children}
        <li><Link to="/signup">Sign up</Link></li>
       </div>
      )
   }
}

export default LoginSignUpLinkPage;