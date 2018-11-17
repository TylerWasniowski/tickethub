import React from 'react';

// Material-ui imports
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { HomeRoute, SellTicketRoute } from '../routes';

const SidebarListItems = (
  <div>
    <a href={`/#${HomeRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </a>
    <a href={`/#${SellTicketRoute}`} style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <ArrowUpwardIcon />
        </ListItemIcon>
        <ListItemText primary="Sell Ticket" />
      </ListItem>
    </a>
  </div>
);

export default SidebarListItems;
