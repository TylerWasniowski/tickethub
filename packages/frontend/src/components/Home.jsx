// @flow
import '../styles/home.css';
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

import Search from './Search';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  state: {
    tickets: Array<string>,
  } = {
    tickets: [],
  };

  getTicketComponents(): Array<Node> {
    const { tickets } = this.state;

    return tickets.map(ticket => <ListItem>{ticket}</ListItem>);
  }

  handleSearch(query) {
    this.setState({ tickets: query.split(' ') });
  }

  render(): Node {
    const { tickets } = this.state;

    return (
      <div className="home">
        <Search onSearch={this.handleSearch} />
        <Paper
          className={`box-container ${
            tickets.length && tickets[0] !== '' ? '' : 'hide'
          }`}
        >
          <List>{this.getTicketComponents()}</List>
        </Paper>
      </div>
    );
  }
}

export default Home;
