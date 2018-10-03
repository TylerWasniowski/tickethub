// @flow
import '../styles/global.css';
import React from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
// import routes from '../routes';

import Home from './home';
import Login from './login';
import CreateAccount from './create-account';
import UpdateAccount from './update-account';

type Props = {
  title: string,
};

const App = ({ title }: Props): Node => (
  <Router>
    <div>
      <div className="sidebar">
        {title}

        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/create-account">Create Account</Link>
        </li>
        <li>
          <Link to="/update-account">Update Account</Link>
        </li>
      </div>

      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/create-account" component={CreateAccount} />
      <Route path="/update-account" component={UpdateAccount} />
    </div>
  </Router>
);

export default hot(module)(App);
