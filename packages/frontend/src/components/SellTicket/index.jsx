// @flow
import '../../styles/home.css';
import React from 'react';

import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import Search from '../Search';
import SimpleForm from '../SimpleForm';
import { SellTicketSubmitRoute } from '../../routes';
import SellTicketForm from './SellTicketForm';

class SellTicket extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  state: {
    query: string,
  } = {
    query: '',
  };

  handleSearch(query) {
    this.setState({ query });
  }

  render(): Node {
    const { query } = this.state;

    return (
      <div className="home">
        <Typography component="h1" variant="title" color="inherit" noWrap>
          Sell Tickets
        </Typography>
        <Search onSearch={this.handleSearch} />
        <SellTicketForm query={query} />
      </div>
    );
  }
}

export default SellTicket;
