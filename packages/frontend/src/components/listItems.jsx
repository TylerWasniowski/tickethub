import React from 'react';
import { hot } from 'react-hot-loader';
import Link from 'react-router-dom';

// Material-ui imports
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';

import {
  HomeRoute,
  LoginRoute,
  CreateAccountRoute,
  UpdateAccountRoute,
} from './routes';

const ListItems = (
  <div>
    <a href={`/#/${HomeRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </a>
    <a href={`/#/${LoginRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </ListItem>
    </a>
    <a href={`/#/${CreateAccountRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Create Account" />
      </ListItem>
    </a>
    <a href={`/#/${UpdateAccountRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Update Account" />
      </ListItem>
    </a>
  </div>
);

export default ListItems;
