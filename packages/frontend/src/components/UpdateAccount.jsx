// @flow
import React from 'react';
import type { Node } from 'react';

import Paper from '@material-ui/core/Paper';

const UpdateAccount = (): Node => (
  <Paper class="box-container">
    <h1>Update Account</h1>
    <form action="/account/submit" method="post">
      <br />
      <p>
        Name
        <input type="text" name="name" />
      </p>
      <p>
        Email
        <input type="text" name="email" />
      </p>
      <p>
        Password
        <input type="password" name="password" />
      </p>
      <p>
        Re-enter
        <input type="password" name="password2" />
      </p>
      <button type="submit">Submit</button>
      <br />
    </form>
  </Paper>
);

export default UpdateAccount;
