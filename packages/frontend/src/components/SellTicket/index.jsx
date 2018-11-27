// @flow
import '../../styles/home.css';
import React from 'react';

import Typography from '@material-ui/core/Typography';

import Search from '../Home/Search';
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
        <Typography
          component="h1"
          className="page-title"
          variant="title"
          color="inherit"
          noWrap
        >
          Sell Tickets
        </Typography>
        <Search onSearch={this.handleSearch} />
        <SellTicketForm query={query} />
      </div>
    );
  }
}

export default SellTicket;
