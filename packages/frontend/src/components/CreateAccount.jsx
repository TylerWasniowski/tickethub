// @flow
import React from 'react';
import type { Node } from 'react';

import Input from '@material-ui/core/Input';

import { CreateAccountSubmitRoute } from '../routes';
import SimpleForm from './SimpleForm';

const CreateAccount = (): Node => (
  <SimpleForm
    formName="Create Account"
    submitText="Create"
    submitRoute={CreateAccountSubmitRoute}
  >
    <Input id="email" autoComplete="email" required />
    <Input id="password" type="password" required />
    <Input id="confirm-password" type="password" required />
  </SimpleForm>
);

export default CreateAccount;
