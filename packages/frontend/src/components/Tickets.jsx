// @flow
import '../styles/home.css';
import React from 'react';

import memoize from 'memoize-one';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { SearchRoute, TicketCheckoutRoute } from '../routes';

type Props = {
  query: string,
};

class Tickets extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.updateTickets = this.updateTickets.bind(this);
    this.getTicketComponents = this.getTicketComponents.bind(this);
  }

  state: {
    tickets: Array<object>,
  } = {
    tickets: [],
  };

  componentDidUpdate() {
    const { query } = this.props;

    this.updateTickets(query);
  }

  updateTickets = memoize(query =>
    fetch(SearchRoute(query))
      .then(res => res.json())
      .then(tickets => this.setState({ tickets }))
      .catch(alert)
  );

  getTicketComponents(): Array<Node> {
    const { tickets } = this.state;

    return tickets.map(ticket => (
      <TableRow hover>
        <TableCell>{ticket.seat}</TableCell>
        <TableCell>
          {`$${(Math.round(ticket.price * 100) / 100).toFixed(2)}`}
        </TableCell>
        <TableCell>
          <Button
            fullWidth
            href={`/#${TicketCheckoutRoute(ticket.id)}`}
            color="primary"
            className="buy-button"
            variant="contained"
          >
            Buy Ticket
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  render(): Node {
    return (
      <Paper className="table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seat</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Buy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.getTicketComponents()}</TableBody>
        </Table>
      </Paper>
    );
  }
}

export default Tickets;
