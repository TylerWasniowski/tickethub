// @flow
import React from 'react';

import memoize from 'memoize-one';

import { CircularProgress } from '@material-ui/core';
import { GetEventImageRoute } from '../routes';

type Props = {
  id: string,
  className: string,
};

class EventImage extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.updateImage = this.updateImage.bind(this);
  }

  state: {
    image: string,
    updateCount: number,
    lastUpdate: number,
  } = {
    updateCount: 0,
    lastUpdate: 0,
  };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { id } = this.props;

    this.updateImage(id);
  }

  updateImage = memoize(id => {
    let { updateCount } = this.state;
    updateCount += 1;
    this.setState({ updateCount }, async () => {
      this.setState({ image: undefined });

      const image = await fetch(GetEventImageRoute(id))
        .then(res => res.json())
        .then(blob => (blob ? Buffer.from(blob).toString() : ''))
        .catch(console.log);

      const { lastUpdate } = this.state;
      if (updateCount > lastUpdate)
        this.setState({ image, lastUpdate: updateCount });
    });
  });

  render() {
    const { className } = this.props;
    const { image } = this.state;

    if (image !== undefined)
      return <img className={className} src={image} alt="" />;

    return <CircularProgress />;
  }
}

export default EventImage;
