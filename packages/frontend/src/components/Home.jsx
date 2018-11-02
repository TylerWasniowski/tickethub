// @flow
import '../styles/home.css';
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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

    return tickets.map(ticket => (
      <TableRow hover>
        <TableCell>{ticket}</TableCell>
        <TableCell>$42.42</TableCell>
      </TableRow>
    ));
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
          <Paper className="table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seat</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.getTicketComponents()}</TableBody>
            </Table>
          </Paper>
        </Paper>
      </div>
    );
  }
}

export default Home;
