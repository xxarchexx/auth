import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';


class SignupForm extends React.Component{
    constructor(props){
        super(props);
        this.data = {
          username:"",
          login:"",
          email:"",
          password:"",
          confirmpassword:""
                };  
       
        this.state = {
            formErrors : {
             login : "",
             email: "",
             password: "",
             username: "",
             confirmpassword : ""
                }
            }
      }

  
/**
 * @param {Event} e
 */
handleChange = e =>{
    e.preventDefault();
    const {name,value } = e.target;
    let formErrors = {...this.state.formErrors};
    
    switch(name){
        case "username":
            formErrors.username = value.length < 3 ?"минимальное кол-во символов 3" : "";
            break;
        case "password":
            formErrors.password = value.length < 5 ?"минимальное кол-во символов 3" : "";
            break;
          case "confirmPassword":
            if(value != this.state.password)
               formErrors.confirmpassword= "Пароль не совпадает" 
            else
            formErrors.confirmpassword = "";
            break;
        case "email":
            {              
            formErrors.email = value.length < 3 ?"минимальное кол-во символов 3" : "";
            
            break;
            }
        default:
            break;  
    }

    this.data[name] = value;
    this.setState({formErrors});
    
    //}, ()=>console.log(this.state) );
}
       
    /**
     *      
     * @param {Event} e 
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        axios.post("/registration" , this.data).then( (e)=> {  this.setState({needRedirect : true }) })
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
            return( window.location.href = "/redirect" );
        }

        // const  categoires = result;

        return (
            <React.Fragment>   
  
                <form id="form" className="container"  method="POST" role="form" noValidate  onSubmit={this.handleSubmit.bind(this)}>      
                    <div class="formgrid">                     

                        
                        <div className="item subcontainer" >     
                            <label>Имя пользователя</label>
                            <div>
                            <label>{this.state.formErrors.username}</label>   
                            <input type="text" id="username"             
                                placeholder="Имя пользователя"
                                type="text"
                                name="username"
                                noValidate
                                onBlur={this.handleChange}                
                            />
                            </div>
                        </div>

                        <div className="item subcontainer" >  
                            <label>Логин</label>
                            <div>
                                <label>{this.state.formErrors.login}</label>   
                                <input type="text" id="login"             
                                placeholder="Логин"
                                type="text"
                                name="login"
                                noValidate
                                onBlur={this.handleChange}          
                        />

                        </div>
                        </div>

                        <div className="item subcontainer" >  
                            <label>email</label>
                            <div>
                                <label>{this.state.formErrors.email}</label>   
                                <input type="text" id="email"             
                                placeholder="EMail"
                                type="text"
                                name="email"
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
                            <label>Подтверждение пароля</label>
                            <div>
                            <label>{this.state.formErrors.confirmpassword}</label>    
                                    </div><input type="text" id="confirmpassword"             
                                placeholder="Подтверждение пароля"
                                type="password"
                                name="confirmPassword"
                                noValidate
                                onBlur={this.handleChange}          
                        />

                            
                        </div>
                        <div className="item subcontainer" >  
                            <button type="submit">Зарегестрировать</button>
                        </div>    
                     </div>
                </form>
            </React.Fragment>
        );
    }
}

export default connect(null,null)(SignupForm);

