// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { UpdateAccountRoute, LogoutSubmitRoute } from '../../routes';

const LoggedInListItems = (props: object) => (
  <div>
    <a href={`/#${UpdateAccountRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemText primary="Edit Account" />
      </ListItem>
    </a>
    <ListItem
      button
      onClick={() => {
        fetch(LogoutSubmitRoute);
        props.onLogout();
      }}
    >
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
);

export default LoggedInListItems;
