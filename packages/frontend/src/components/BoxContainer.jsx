// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';

class BoxContainer extends React.PureComponent<Props> {
  render() {
    const { children } = this.props;

    return <Paper className="box-container">{children}</Paper>;
  }
}

export default BoxContainer;
