// @flow
import React from 'react';
import type { Node } from 'react';

import Cookies from 'js-cookie';

import Input from '@material-ui/core/Input';

import { Typography } from '@material-ui/core';
import { UpdateAccountSubmitRoute, LoginRoute } from '../routes';
import SimpleForm from './SimpleForm';

class UpdateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  state: {
    password: string,
  } = {
    password: '',
  };

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { password } = this.state;

    return (
      <SimpleForm
        formName="Update Account"
        submitText="Update"
        submitRoute={UpdateAccountSubmitRoute}
        onSubmit={() => alert('Account updated.')}
        onFail={reason => {
          alert(reason);
          window.location.href = `/#${LoginRoute}`;
        }}
      >
        <Input
          id="email"
          autoComplete="email"
          defaultValue={Cookies.get('email')}
          inputProps={{
            pattern:
              '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$',
          }}
        />
        <Input
          id="password"
          onChange={this.handlePasswordChange}
          type="password"
        />
        <Input
          id="confirmPassword"
          type="password"
          inputProps={{
            pattern: password.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
          }}
        />
        <Input
          id="name"
          autoComplete="name"
          defaultValue={Cookies.get('name')}
        />
        <Input
          id="address"
          autoComplete="address"
          defaultValue={Cookies.get('address')}
        />
        <Input id="cardNumber" />
      </SimpleForm>
    );
  }
}

export default UpdateAccount;
