// @flow
import React from 'react';
import type { Node } from 'react';

import Cookies from 'js-cookie';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';

import { LoginSubmitRoute, HomeRoute } from '../routes';
import SimpleForm from './SimpleForm';

const Login = (): Node => (
  <SimpleForm
    formName="Login"
    submitText="Login"
    submitRoute={LoginSubmitRoute}
    onSubmit={() => {
      alert('Logged in.');
      window.location.href = `/#${HomeRoute}`;
    }}
    onFail={reason => alert(reason)}
  >
    <Input
      id="email"
      autoComplete="email"
      inputProps={{
        pattern:
          '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$',
      }}
      required
      autoFocus
    />
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
