import React from 'react'
import reactDOM from 'react-dom'

class Renderer extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        return (
        <div className="root-container">
            <div className="box-controller">
                    <div className="controller">
                        Login
                    </div>
                    <div className="controller">
                        Register
                    </div>
                </div>

            <div className="box-container">
                <LoginBox/>
                
            </div>
        </div>
        )
    }
}

export default Renderer

class LoginBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    submitLogin(e){
        
    }

    render(){
        <div className="inner-container">
            <div className="box">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" className="login-input" placeholder="Username"/>
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="text" name="password" className="login-input" placeholder="Password"/>
                </div>

               <button type="button" className="login-btn" onClick={this.submitLogin.bind(this)}>Login</button>
            </div>
        </div>
    }
}