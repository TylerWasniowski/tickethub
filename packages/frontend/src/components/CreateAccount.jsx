// @flow
import React from 'react';
import type { Node } from 'react';

import Input from '@material-ui/core/Input';

import { CreateAccountSubmitRoute } from '../routes';
import SimpleForm from './SimpleForm';

class CreateAccount extends React.Component {
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
        formName="Create Account"
        submitText="Create"
        submitRoute={CreateAccountSubmitRoute}
        onSubmit={() => alert('Account created.')}
        onFail={alert}
      >
        <Input
          id="email"
          autoComplete="email"
          inputProps={{
            pattern:
              '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$',
          }}
          required
        />
        <Input
          id="password"
          type="password"
          onChange={this.handlePasswordChange}
          required
        />
        <Input
          id="confirmPassword"
          type="password"
          inputProps={{
            pattern: password.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
          }}
          required
        />
      </SimpleForm>
    );
  }
}

export default CreateAccount;
