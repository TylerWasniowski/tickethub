// @flow
import '../styles/style.css';
import React, { Component, Fragment } from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';

type Props = {
  title: string,
};

export default hot(module)(
  class App extends Component<Props> {
    props: Props;

    static displayName = 'App';

    static defaultProps = {};

    constructor(props: Props) {
      super(props);
      this.state = {};
    }

    render(): Node {
      const { title } = this.props;
      return <Fragment>{title}</Fragment>;
    }
  }
);
