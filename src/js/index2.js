import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';

import jwtDecode from 'jwt-decode';

import { BrowserRouter, Route } from 'react-router-dom';
import LoginSignUpLinkPage from './rootContainers/LoginSignUpLinkPage';


// import requireAuth from './utils/requireAuth';



const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);



render(
  <Provider store={store}>
   <BrowserRouter>
    <Route path="/login"  component={LoginSignUpLinkPage} />     
  </BrowserRouter>
    
  </Provider>, document.getElementById('app'));
