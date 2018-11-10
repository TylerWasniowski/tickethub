// @flow
import '../styles/checkout.css';
import React from 'react';

import { Typography, CircularProgress } from '@material-ui/core';
import { TotalTicketPriceRoute } from '../routes';

type Props = {
  id: string,
};

class TotalPrice extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.updatePrice = this.updatePrice.bind(this);
  }

  state: {
    totalPrice: number,
  } = {};

  componentDidMount() {
    this.updatePrice();
  }

  updatePrice() {
    const { id } = this.props;

    fetch(TotalTicketPriceRoute(id))
      .then(res => res.json())
      .then(totalPrice => (Math.round(totalPrice * 100) / 100).toFixed(2))
      .then(totalPrice => this.setState({ totalPrice }))
      .catch(console.log);
  }

  render() {
    const { totalPrice } = this.state;

    if (totalPrice !== undefined)
      return (
        <Typography
          component="h1"
          variant="title"
          color="inherit"
          noWrap
          className="center form-title"
        >
          {`Total Price: ${totalPrice}`}
        </Typography>
      );

    return (
      <div className="center">
        <CircularProgress />
      </div>
    );
  }
}

export default TotalPrice;
