// @flow
import '../styles/home.css';
import React from 'react';

import memoize from 'memoize-one';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { SearchTicketsRoute, TicketCheckoutRoute } from '../routes';

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
    eventId: string,
    eventName: string,
    tickets: Array<object>,
    ticketsQuery: string,
  } = {
    eventId: '',
    eventName: '',
    tickets: [],
    ticketsQuery: '',
  };

  componentDidUpdate() {
    const { query } = this.props;

    this.updateTickets(query);
  }

  updateTickets = memoize(query =>
    fetch(SearchTicketsRoute(query))
      .then(res => res.json())
      .then(res =>
        this.setState({
          eventId: res.eventId,
          eventName: res.eventName,
          tickets: res.tickets,
        })
      )
      .then(() => this.setState({ ticketsQuery: query }))
      .catch(alert)
  );

  getTicketComponents(): Array<Node> {
    const { eventId, eventName, tickets } = this.state;

    return tickets.map(ticket => (
      <TableRow hover>
        <TableCell>{ticket.seat}</TableCell>
        <TableCell>
          {`$${(Math.round(ticket.price * 100) / 100).toFixed(2)}`}
        </TableCell>
        <TableCell>
          <Button
            fullWidth
            href={`/#${TicketCheckoutRoute(eventName, eventId, ticket.id)}`}
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
    const { query } = this.props;
    const { ticketsQuery } = this.state;

    if (ticketsQuery === query)
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

    return <CircularProgress size={60} />;
  }
}

export default Tickets;
