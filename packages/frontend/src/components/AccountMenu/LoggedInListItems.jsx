// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { UpdateAccountRoute, LogoutSubmitRoute } from '../../routes';

const LoggedInListItems = (
  <div>
    <a href={`/#${UpdateAccountRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemText primary="Edit Account" />
      </ListItem>
    </a>
    <ListItem button onClick={() => fetch(LogoutSubmitRoute)}>
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
);

export default LoggedInListItems;
