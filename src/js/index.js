import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/SignUpForm.jsx/index.js.js';
import { createStore, applyMiddleware } from 'redux'; 

import {Provider} from 'react-redux';

import rootReducer from './reduser/index.js';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(rootReducer)}>
    <App />
  </Provider>
  , document.querySelector('.root'));
