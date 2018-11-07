// @flow
import React from 'react';
import type { Node } from 'react';

import Cookies from 'js-cookie';

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
    <Input
      id="email"
      autoComplete="email"
      defaultValue={Cookies.get('email')}
      required
    />
    <Input
      id="name"
      autoComplete="name"
      defaultValue={Cookies.get('name')}
      required
    />
  </SimpleForm>
);

export default UpdateAccount;
