import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import jwtDecode from 'jwt-decode';
import { BrowserRouter, Route } from 'react-router-dom';
// import App from './rootContainers/App';
// import Greetings from './components/Greetings';
 import signUpContainer from './containers/signUpContainer';
// import SignIn from './components/login';
import signInContainer from './containers/signInContainer'
import registerServiceWorker from './registerServiceWorker'; 
const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : null;

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk)    
  )
);

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

render(
  <Provider store={store}>
   <BrowserRouter> 
    <Route path="/login"  component={signInContainer} />
    {/* <Route path="/index2" component={Greetings} /> */}
    {/* <Route path="/index43" component={Greetings} />*/}
    <Route path="/signup"   component={signUpContainer}/> 
  </BrowserRouter>
    
  </Provider>, document.getElementById('app'));
registerServiceWorker();