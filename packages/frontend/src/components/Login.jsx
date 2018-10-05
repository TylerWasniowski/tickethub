// @flow
import React from 'react';
import type { Node } from 'react';

const Login = (): Node => (
  <div>
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
  </div>
);

export default Login;
