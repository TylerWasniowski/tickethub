// @flow
import React from 'react';
import type { Node } from 'react';

import Cookies from 'js-cookie';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';

import { LoginSubmitRoute } from '../routes';
import SimpleForm from './SimpleForm';

const Login = (): Node => (
  <SimpleForm
    formName="Login"
    submitText="Login"
    submitRoute={LoginSubmitRoute}
    onSubmit={() => alert('Logged in.')}
    onFail={() => alert('Incorrect credentials.')}
  >
    <Input id="email" autoComplete="email" required autoFocus />
    <Input
      id="password"
      autoComplete="current-password"
      type="password"
      required
    />
    <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label="Remember me"
    />
  </SimpleForm>
);

export default Login;
