// @flow
import React from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';

const CreateAccount = (): Node => (
  <div>
    <h1>Create an Account</h1>
    <form action="createaccount/submit" method="post">
      <br />
      <p>
        Name <input type="text" name="name" />
      </p>
      <p>
        Username <input type="text" name="username" />
      </p>
      <p>
        Email <input type="text" name="email" />
      </p>
      <p>
        Password <input type="password" name="password" />
      </p>
      <p>
        Re-enter <input type="password" name="password2" />
      </p>
      <button type="submit">Submit</button>
      <br />
    </form>
  </div>
);

export default CreateAccount;
