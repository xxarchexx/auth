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
    //   shouldComponentUpdate(nextProps, nextState) {
    //     return false
    //   }    

  
/**
 * @param {Event} e
 */
handleChange = e =>{
    e.preventDefault();
    const {name,value } = e.target;
    let formErrors = {...this.state.formErrors};
    
    switch(name){
        case "login":   {
            formErrors.login = value.length < 3 ?"минимальное кол-во символов 3" : "";
            break;
             }
        case "password":      { 
            formErrors.password = value.length < 5 ?"минимальное кол-во символов 3" : "";
            break;          
            }
        default:
            break;  
    }
    this.data[e.target.name] = e.target.value;
    this.setState({formErrors});
    
    //}, ()=>console.log(this.state) );
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

   
  
    
    /**
     * @param {Event} e
     */
    lookupChanged = (e) => {
      
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
                // return( 
                    // <Redirect push to="/redirect" />
                    window.location.href = "/redirect" 
                // this.props.history.push('/redirect')
                //
            );
            //return( window.location.href = "/redirect" );
        }

        // const  categoires = result;

        return (
            <React.Fragment>   
  
                <form id="form" className="container"  method="POST" role="form" noValidate  onSubmit={this.handleSubmit.bind(this)}>      
                    <div className="formgrid">                     

                        
                        <div className="item subcontainer" >     
                            <label>Логин/email</label>
                            <div>
                            <label>{this.state.formErrors.login}</label>   
                            <input type="text" id="login"             
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
                                <label>{this.state.formErrors.password}</label>    
                                <input type="text" id="password"             
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

