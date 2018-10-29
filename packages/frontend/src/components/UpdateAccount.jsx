// @flow
import React from 'react';
import type { Node } from 'react';

import Input from '@material-ui/core/Input';

import { UpdateAccountSubmitRoute } from '../routes';
import SimpleForm from './SimpleForm';

const UpdateAccount = (): Node => (
  <SimpleForm
    formName="Update Account"
    submitText="Update"
    submitRoute={UpdateAccountSubmitRoute}
  >
    <Input id="password" type="password" required />
    <Input id="confirm-password" type="password" required />
    <Input id="email" autoComplete="email" required />
    <Input id="name" autoComplete="name" required />
  </SimpleForm>
);

export default UpdateAccount;
