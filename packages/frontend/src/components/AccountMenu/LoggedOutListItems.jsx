// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { LoginRoute, CreateAccountRoute } from '../../routes';

const LoggedOutListItem = (
  <div>
    <a href={`/#${CreateAccountRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemText primary="Create Account" />
      </ListItem>
    </a>
    <a href={`/#${LoginRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemText primary="Login" />
      </ListItem>
    </a>
  </div>
);

export default LoggedOutListItem;
