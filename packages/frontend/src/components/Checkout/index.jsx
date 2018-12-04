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
    this.handleShippingAddressChange = this.handleShippingAddressChange.bind(
      this
    );
    this.handleShippingMethodChange = this.handleShippingMethodChange.bind(
      this
    );
  }

  state: {
    lockedUntil: moment.Moment,
    timeLeftDisplay: string,
    shippingAddress: string,
    shippingMethod: string,
    updateInterval: number,
  } = {
    shippingAddress: Cookies.get('address') || '',
    timeLeftDisplay: '',
    shippingMethod: 'fedex',
  };

  componentDidMount() {
    this.lockTicket();
  }

  componentWillUnmount() {
    const { updateInterval } = this.state;

    clearInterval(updateInterval);
  }

  lockTicket() {
    const { match } = this.props;
    const { ticketId } = match.params;

    fetch(TicketLockRoute(ticketId), { method: 'POST' })
      .then(res => {
        if (res.status !== 200) {
          alert(res.text());
          this.componentWillUnmount();
          window.location.href = `/#${LoginRoute}`;
        }
        return res;
      })
      .then(res => res.json())
      .then(lockedUntil =>
        this.setState({ lockedUntil: moment(lockedUntil) }, () => {
          this.setState({
            updateInterval: setInterval(this.updateTimeLeft, 1000),
          });
        })
      )
      .catch(console.log);
  }

  updateTimeLeft() {
    const { lockedUntil } = this.state;

    if (!lockedUntil || moment().isSameOrAfter(lockedUntil)) {
      alert('You ran out of time.');
      this.componentWillUnmount();
      window.location.href = `/#${HomeRoute}`;
    }

    this.setState({
      timeLeftDisplay: moment(lockedUntil.diff(moment())).format('mm:ss'),
    });
  }

  handleShippingAddressChange(event) {
    this.setState({ shippingAddress: event.target.value });
  }

  handleShippingMethodChange(shippingMethod) {
    this.setState({ shippingMethod });
  }

  render() {
    const { match } = this.props;
    const { eventName, eventId, ticketId } = match.params;
    const { timeLeftDisplay, shippingAddress, shippingMethod } = this.state;

    return (
      <SimpleForm
        formName={`Checkout Ticket for ${eventName}`}
        submitText="Checkout"
        submitRoute={CheckoutSubmitRoute}
        onSubmit={() => {
          alert('Ticket purchased. Please wait for delivery.');
          window.location.href = `/#${HomeRoute}`;
        }}
        onFail={reason => {
          alert(reason);
          this.componentWillUnmount();
          window.location.href = `/#${LoginRoute}`;
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
        <Input
          id="expirationDate"
          type="date"
          defaultValue={moment().format('YYYY-MM-DD')}
          required
        />
        <Input id="securityCode" required />
        <Input id="nameOnCard" required />
        <Input
          id="billingAddress"
          defaultValue={Cookies.get('address')}
          required
        />
        <Input
          id="shippingAddress"
          defaultValue={Cookies.get('address')}
          onChange={this.handleShippingAddressChange}
          required
        />
        <CheckoutInfo
          id={ticketId}
          address={shippingAddress}
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
