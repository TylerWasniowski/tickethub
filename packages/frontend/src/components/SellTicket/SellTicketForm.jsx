// @flow
import React from 'react';

import memoize from 'memoize-one';

import Input from '@material-ui/core/Input';

import { CircularProgress } from '@material-ui/core';
import SimpleForm from '../SimpleForm';
import { SellTicketSubmitRoute, SearchRoute } from '../../routes';
import EventImage from '../EventImage';

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
    eventId: undefined,
    eventName: undefined,
  };

  componentDidUpdate() {
    const { query } = this.props;

    this.updateEvent(query);
  }

  updateEvent = memoize(query => {
    if (!query) return;

    this.setState({ eventId: undefined, eventName: undefined });
    fetch(SearchRoute(query))
      .then(res => res.json())
      .then(events => (events.length ? events : [{ id: '', name: '' }]))
      .then(events =>
        this.setState({
          eventId: events[0].id,
          eventName: events[0].name,
        })
      )
      .catch(console.log);
  });

  render() {
    const { query } = this.props;
    const { eventId, eventName } = this.state;

    if (eventId === '') {
      return (
        <SimpleForm
          formName="Sell Ticket for New Event"
          submitText="Sell"
          submitRoute={SellTicketSubmitRoute}
          className="sell-ticket-form"
        >
          <Input id="eventName" defaultValue={query} required />
          <Input id="eventDate" required />
          <Input id="eventTime" required />
          <Input id="eventCity" />
          <Input id="eventVenue" />
          <Input id="eventDetails" />
          <Input id="seat" required />
          <Input id="price" required />
        </SimpleForm>
      );
    }

    if (eventId)
      return (
        <SimpleForm
          formName={`Sell Ticket for ${eventName}`}
          submitText="Sell"
          submitRoute={SellTicketSubmitRoute}
          className="sell-ticket-form"
        >
          <EventImage id={eventId} className="form-event-image" />
          <Input id="eventId" defaultValue={eventId} hidden required />
          <Input id="seat" required />
          <Input id="price" required />
        </SimpleForm>
      );

    return <CircularProgress class={`form-loading ${query ? '' : 'hide'}`} />;
  }
}

export default SellTicketForm;
