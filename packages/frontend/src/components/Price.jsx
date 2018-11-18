// @flow
import '../styles/checkout.css';
import React from 'react';

import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { TotalTicketPriceRoute } from '../routes';

type Props = {
  id: string,
  onChange?: string => void,
};

class Price extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  state: {
    shippingMethod: string,
    totalPrice: number,
  } = {
    shippingMethod: 'fedex',
  };

  componentDidMount() {
    this.updatePrice();
  }

  updatePrice() {
    const { id } = this.props;

    this.setState({ totalPrice: undefined });
    fetch(TotalTicketPriceRoute(id))
      .then(res => res.json())
      .then(totalPrice => (Math.round(totalPrice * 100) / 100).toFixed(2))
      .then(totalPrice => this.setState({ totalPrice }))
      .catch(console.log);
  }

  handleSelectionChange(event) {
    const { onChange } = this.props;
    const shippingMethod = event.target.value;

    this.setState({ shippingMethod }, this.updatePrice);
    onChange(shippingMethod);
  }

  render() {
    const { onChange } = this.props;
    const { shippingMethod, totalPrice } = this.state;

    const priceDisplay =
      totalPrice !== undefined ? (
        <Typography
          component="h1"
          variant="title"
          color="inherit"
          noWrap
          className="center form-title"
        >
          {`Total Price: ${totalPrice}`}
        </Typography>
      ) : (
        <div className="center">
          <CircularProgress />
        </div>
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
        {priceDisplay}
      </div>
    );
  }
}
Price.defaultProps = { onChange: () => {} };

export default Price;
