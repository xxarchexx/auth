import React from 'react';
// import {connect} from 'react-redux';
import axios from 'axios';
import {Redirect ,withRouter } from 'react-router-dom';
import './style.css';

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.data = {
                    login:"",       
                    password:""                 
                };  
       
        this.state = {
             formErrors : {            
                  login : "",         
                  password: ""         
                }
              };
      }    
  
/**
 * @param {Event} e
 */
handleChange = e =>{
    e.preventDefault();
    const {name,value } = e.target;
    let formErrors = {...this.state.formErrors};
    
    switch(name){
        case "login":   {
            formErrors.login = value.length < 3 ?"requried 3 chars !" : "";
            break;
             }
        case "password":      { 
            formErrors.password = value.length < 5 ?"requried 5 chars !" : "";
            break;          
            }
        default:
            break;  
    }
    this.data[e.target.name] = e.target.value;
    this.setState({formErrors});   
}
       
    /**
     *      
     * @param {Event} e 
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        if(this.data.login.length > 3 && this.data.password.length > 3) 
          axios.post("/login" , this.data).then( (e)=> {  this.setState({needRedirect : true }) })
    } 
  
    
   

  
    render(){

        let { dispatch, ...data } = this.props;
        // const actionGetCat =(dispatch)=>{
        //      return bindActionCreators({getcategoriesForGoods},dispatch)
        //   }

        // let result =  actionGetCat(dispatch).getcategoriesForGoods();
        
       

        const needRedirect = this.state.needRedirect
        if(needRedirect){
            return(                 
                window.location.href = "/redirect"                
            );
            }

        return (
            <React.Fragment>   
  
                <form id="form" className="container"  method="POST" role="form" noValidate  onSubmit={this.handleSubmit.bind(this)}>      
                    <div className="formgrid flex">                   

                        
                        <div className="item subcontainer flex" >     
                            <label>Логин/email</label>
                            <div>
                            <label className="flex">{this.state.formErrors.login}</label>   
                            <input className="flex" type="text" id="login"             
                                placeholder="Введите логин или email"
                                type="text"
                                name="login"
                                noValidate
                                onBlur={this.handleChange}                
                            />
                            </div>
                        </div>
                     
                        <div className="item subcontainer" >  
                            <label>Пароль</label>
                            <div>
                                <label className="flex">{this.state.formErrors.password}</label>    
                                <input className="flex" type="text" id="password"             
                                placeholder="Пароль"
                                type="password"
                                name="password"
                                noValidate
                                onBlur={this.handleChange}          />                            
                             </div>                        
                        </div>

                        <div className="item subcontainer" >  
                            <button type="submit">Войти</button>
                        </div>    
                     </div>
                </form>
            </React.Fragment>
        );
    }
}


export default LoginForm;