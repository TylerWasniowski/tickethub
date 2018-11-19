// @flow
import React from 'react';

import moment from 'moment';

import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { CheckoutInfoRoute, LoginRoute } from '../../routes';

type Props = {
  id: string,
  address: string,
  onChange?: string => void,
};

class CheckoutInfo extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  state: {
    shippingMethod: string,
    ticketPrice: number,
    fee: number,
    shippingPrice: number,
    totalPrice: number,
    eta: string,
  } = {
    shippingMethod: 'fedex',
  };

  componentDidMount() {
    this.updatePrice();
  }

  updatePrice() {
    const { id, address } = this.props;
    const { shippingMethod } = this.state;

    this.setState({ totalPrice: undefined });
    fetch(CheckoutInfoRoute(id, shippingMethod, address))
      .then(res => {
        if (res.status !== 200) window.location.href = `/#${LoginRoute}`;
        return res;
      })
      .then(res => res.json())
      .then(info =>
        this.setState({
          ticketPrice: this.round(info.ticketPrice),
          fee: this.round(info.fee),
          shippingPrice: this.round(info.shippingPrice),
          totalPrice: this.round(
            info.ticketPrice + info.fee + info.shippingPrice
          ),
          eta: this.formatEta(info.eta),
        })
      )
      .catch(console.log);
  }

  handleSelectionChange(event) {
    const { onChange } = this.props;
    const shippingMethod = event.target.value;

    this.setState({ shippingMethod }, this.updatePrice);
    onChange(shippingMethod);
  }

  formatEta(eta) {
    const { shippingMethod } = this.state;

    if (shippingMethod === 'uber') {
      const diffMinutes = Math.round(
        moment.duration(moment(eta).diff(moment())).asMinutes()
      );
      if (diffMinutes === 1) return `${diffMinutes} minute`;
      return `${diffMinutes} minutes`;
    }
    const diffDays = Math.round(moment(eta).diff(moment(), 'days', true));
    if (diffDays === 1) return `${diffDays} day`;
    return `${diffDays} days`;
  }

  round = num => (Math.round(num * 100) / 100).toFixed(2);

  render() {
    const {
      shippingMethod,
      ticketPrice,
      fee,
      shippingPrice,
      totalPrice,
      eta,
    } = this.state;

    const infoBreakdown =
      totalPrice !== undefined ? (
        <React.Fragment>
          <Typography
            component="h1"
            variant="title"
            color="inherit"
            noWrap
            className="form-title"
          >
            {`Ticket Price: ${ticketPrice}`}
          </Typography>
          <Typography
            component="h1"
            variant="title"
            color="inherit"
            noWrap
            className="form-title"
          >
            {`Fee: ${fee}`}
          </Typography>
          <Typography
            component="h1"
            variant="title"
            color="inherit"
            noWrap
            className="form-title underline"
          >
            {`+ Shipping Price: ${shippingPrice}`}
          </Typography>
          <Typography
            component="h1"
            variant="title"
            color="inherit"
            noWrap
            className="form-title"
          >
            {`Total Price: ${totalPrice}`}
          </Typography>
          <br />
          <Typography
            component="h1"
            variant="title"
            color="inherit"
            noWrap
            className="form-title"
          >
            {`Estimated Delivery: ${eta}`}
          </Typography>
        </React.Fragment>
      ) : (
        <CircularProgress />
      );

    return (
      <div className="price">
        <RadioGroup
          className="shipping-choices"
          aria-label="shippingMethod"
          onChange={this.handleSelectionChange}
          value={shippingMethod}
        >
          <FormControlLabel control={<Radio />} label="UPS" value="ups" />
          <FormControlLabel control={<Radio />} label="FedEx" value="fedex" />
          <FormControlLabel control={<Radio />} label="Uber" value="uber" />
        </RadioGroup>
        <div className="right-align">{infoBreakdown}</div>
      </div>
    );
  }
}
CheckoutInfo.defaultProps = { onChange: () => {} };

export default CheckoutInfo;
