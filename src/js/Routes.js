import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/App';
import Greetings from './components/Greetings';
import SignupPage from './components/signup/SignupPage';
//import LoginPage from './components/login/LoginPage';
import NewEventPage from './components/events/NewEventPage';

import requireAuth from './utils/requireAuth';

export default (
  <BrowserRouter>
    <Route path="index2" component={App} />
    <Route path="helllo" component={Greetings} />
    <Route path="signup" component={SignupPage} />
    <Route path="new-event" component={requireAuth(NewEventPage)} />
  </BrowserRouter>
);