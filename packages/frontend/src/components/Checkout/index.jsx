// @flow
import '../../styles/checkout.css';
import React from 'react';

import Cookies from 'js-cookie';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import {
  TicketLockRoute,
  CheckoutSubmitRoute,
  LoginRoute,
  HomeRoute,
  TicketUnlockRoute,
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
      .then(async res => {
        if (res.status !== 200) {
          alert(await res.text());
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
        <Input
          id="cardNumber"
          inputProps={{
            pattern:
              '^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
          }}
          required
        />
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
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="cancel-button"
          onClick={() => {
            fetch(TicketUnlockRoute(ticketId), { method: 'POST' })
              .then(async res => {
                if (res.status !== 200) {
                  alert('Cancel failed.');
                  window.location.href = `/#${HomeRoute}`;
                  throw new Error(`Cancel failed: ${await res.text()}`);
                }
                return '';
              })
              .then(() => alert('Purchase canceled.'))
              .then(() => {
                window.location.href = `/#${HomeRoute}`;
                return '';
              })
              .catch(console.log);
          }}
        >
          Cancel
        </Button>
      </SimpleForm>
    );
  }
}

export default Checkout;
