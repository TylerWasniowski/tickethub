// @flow
import React from 'react';

import memoize from 'memoize-one';

import Input from '@material-ui/core/Input';

import SimpleForm from '../SimpleForm';
import { SellTicketSubmitRoute, SearchRoute } from '../../routes';

type Props = {
  query: string,
};

class SellTicketForm extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.updateEvent = this.updateEvent.bind(this);
  }

  state: {
    eventId: string,
    eventName: string,
  } = {
    eventId: '',
    eventName: '',
  };

  componentDidUpdate() {
    const { query } = this.props;

    this.updateEvent(query);
  }

  updateEvent = memoize(query => {
    console.log(query);
    fetch(SearchRoute(query))
      .then(res => res.json())
      .then(events =>
        this.setState({
          eventId: events[0].id,
          eventName: events[0].name,
        })
      )
      .catch(console.log);
  });

  render() {
    const { eventId, eventName } = this.state;

    return (
      <SimpleForm
        formName={`Sell Ticket for ${eventName}`}
        submitText="Sell"
        submitRoute={SellTicketSubmitRoute}
        className={eventId ? '' : 'hide'}
      >
        <Input id="eventId" defaultValue={eventId} hidden required />
        <Input id="seat" required />
        <Input id="price" required />
      </SimpleForm>
    );
  }
}

export default SellTicketForm;
