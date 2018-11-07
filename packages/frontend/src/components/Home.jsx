// @flow
import '../styles/home.css';
import React from 'react';

import Paper from '@material-ui/core/Paper';

import Search from './Search';
import Tickets from './Tickets';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  state: {
    query: string,
  } = {
    query: '',
  };

  handleSearch(query) {
    this.setState({ query });
  }

  render(): Node {
    const { query } = this.state;

    return (
      <div className="home">
        <Search onSearch={this.handleSearch} />
        <Paper className={`box-container ${query ? '' : 'hide'}`}>
          <Tickets query={query} />
        </Paper>
      </div>
    );
  }
}

export default Home;
