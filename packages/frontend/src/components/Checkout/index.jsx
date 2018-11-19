// @flow
import '../../styles/checkout.css';
import React from 'react';

import Cookies from 'js-cookie';
import moment from 'moment';

import Input from '@material-ui/core/Input';

import Typography from '@material-ui/core/Typography';
import {
  TicketLockRoute,
  CheckoutSubmitRoute,
  LoginRoute,
  HomeRoute,
} from '../../routes';

import EventImage from '../EventImage';
import SimpleForm from '../SimpleForm';
import CheckoutInfo from './CheckoutInfo';

type Props = {
  match: object,
};

class Checkout extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.lockTicket = this.lockTicket.bind(this);
    this.updateTimeLeft = this.updateTimeLeft.bind(this);
    this.handleShippingMethodChange = this.handleShippingMethodChange.bind(
      this
    );
  }

  state: {
    lockedUntil: moment.Moment,
    timeLeftDisplay: string,
    shippingMethod: string,
  } = {
    timeLeftDisplay: '',
    shippingMethod: 'fedex',
  };

  componentDidMount() {
    this.lockTicket();
  }

  lockTicket() {
    const { match } = this.props;
    const { ticketId } = match.params;

    fetch(TicketLockRoute(ticketId), { method: 'POST' })
      .then(res => {
        if (res.status !== 200) window.location.href = `/#${LoginRoute}`;
        return res;
      })
      .then(res => res.json())
      .then(lockedUntil => this.setState({ lockedUntil: moment(lockedUntil) }))
      .then(() => setInterval(this.updateTimeLeft, 1000))
      .catch(alert);
  }

  updateTimeLeft() {
    const { lockedUntil } = this.state;
    this.setState({
      timeLeftDisplay: moment(lockedUntil.diff(moment())).format('mm:ss'),
    });
  }

  handleShippingMethodChange(shippingMethod) {
    this.setState({ shippingMethod });
  }

  render() {
    const { match } = this.props;
    const { eventName, eventId, ticketId } = match.params;
    const { timeLeftDisplay, shippingMethod } = this.state;

    return (
      <SimpleForm
        formName={`Checkout Ticket for ${eventName}`}
        submitText="Checkout"
        submitRoute={CheckoutSubmitRoute}
        onSubmit={() => {
          alert('Ticket purchased. Please wait for delivery.');
          window.location.href = `/#${HomeRoute}`;
        }}
      >
        <EventImage id={eventId} />
        <Typography
          component="h1"
          variant="title"
          color="inherit"
          noWrap
          className="center form-title"
        >
          {timeLeftDisplay}
        </Typography>
        <Input id="cardNumber" required />
        <Input id="expirationDate" required />
        <Input id="securityCode" required />
        <Input id="nameOnCard" required />
        <Input
          id="billingAddress"
          defaultValue={Cookies.get('address')}
          required
        />
        <CheckoutInfo
          id={ticketId}
          onChange={this.handleShippingMethodChange}
        />
        <Input
          id="shippingMethod"
          defaultValue={shippingMethod}
          hidden
          required
        />
      </SimpleForm>
    );
  }
}

export default Checkout;
