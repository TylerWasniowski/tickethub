// @flow
import React from 'react';

import Cookies from 'js-cookie';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import PeopleIcon from '@material-ui/icons/People';

import LoggedInListItems from './LoggedInListItems';
import LoggedOutListItems from './LoggedOutListItems';

class AccountMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggleShowList = this.toggleShowList.bind(this);
  }

  state: {
    showMenu: boolean,
  } = {
    showMenu: false,
  };

  toggleShowList() {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  render() {
    const { showMenu } = this.state;

    return (
      <div className="menu-container">
        <IconButton
          color="inherit"
          className="menu-icon"
          onClick={this.toggleShowList}
        >
          <PeopleIcon />
        </IconButton>
        <div className={`menu-arrow ${showMenu ? '' : 'hide'}`} />
        <List className={`menu ${showMenu ? '' : 'hide'}`}>
          {Cookies.get('name') ? LoggedInListItems : LoggedOutListItems}
        </List>
      </div>
    );
  }
}

export default AccountMenu;
