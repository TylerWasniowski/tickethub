// @flow
import React from 'react';
import type { Node } from 'react';

import BoxContainer from './BoxContainer';

const Login = (): Node => (
  <BoxContainer>
    <h1>Login</h1>
    <p>Login</p>
    <form action="login/submit" method="post">
      <br />
      <p>
        Username <input type="text" name="username" />
      </p>
      <p>
        Password <input type="password" name="password" />
      </p>
      <button type="submit">Submit</button>
      <br />
    </form>
  </BoxContainer>
);

export default Login;
