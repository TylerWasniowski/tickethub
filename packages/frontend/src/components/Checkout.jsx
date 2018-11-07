// @flow
import '../styles/checkout.css';
import React from 'react';
import type { Node } from 'react';

import moment from 'moment';

import Input from '@material-ui/core/Input';

import { Typography } from '@material-ui/core';
import { TicketLockRoute, UpdateAccountSubmitRoute } from '../routes';

import SimpleForm from './SimpleForm';

type Props = {
  match: object,
};

class Checkout extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.lockTicket = this.lockTicket.bind(this);
    this.updateTimeLeft = this.updateTimeLeft.bind(this);
  }

  state: {
    lockedUntil: moment.Moment,
    timeLeftDisplay: string,
  } = {
    timeLeftDisplay: '',
  };

  componentDidMount() {
    this.lockTicket();
  }

  lockTicket() {
    const { match } = this.props;
    const { id } = match.params;

    fetch(TicketLockRoute(id), { method: 'POST' })
      .then(res => res.json())
      .then(lockedUntil => this.setState({ lockedUntil: moment(lockedUntil) }))
      .then(_ => setInterval(this.updateTimeLeft, 1000))
      .catch(alert);
  }

  updateTimeLeft() {
    const { lockedUntil } = this.state;
    this.setState({
      timeLeftDisplay: moment(lockedUntil.diff(moment())).format('mm:ss'),
    });
  }

  render() {
    const { match } = this.props;
    const { event } = match.params;
    const { timeLeftDisplay } = this.state;

    return (
      <SimpleForm
        formName={`Checkout Ticket for ${event}`}
        submitText="Checkout"
        submitRoute={UpdateAccountSubmitRoute}
      >
        <Typography
          component="h1"
          variant="title"
          color="inherit"
          noWrap
          className="timer form-title"
        >
          {timeLeftDisplay}
        </Typography>
        <Input id="address" autoComplete="address" required />
        <Input id="paymentInfo" required />
      </SimpleForm>
    );
  }
}

export default Checkout;
