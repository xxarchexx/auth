import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { setCurrentUser } from './actions/authActions';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/App';
import Greetings from './components/Greetings';
import SignupPage from './components/signup/SignupPage';
//import LoginPage from './components/login/LoginPage';
import NewEventPage from './components/events/NewEventPage';

// import requireAuth from './utils/requireAuth';



const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

render(
  <Provider store={store}>
   <BrowserRouter>
     <Route path="/index2" component={App} /> */}
   <Route path="/index43" component={Greetings} />
     <Route path="/signup" component={SignupPage} />
  </BrowserRouter>
    
  </Provider>, document.getElementById('app'));
