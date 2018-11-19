// @flow
import '../../styles/home.css';
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
        <Typography
          component="h1"
          className="page-title"
          variant="title"
          color="inherit"
          noWrap
        >
          Buy Tickets
        </Typography>
        <Search onSearch={this.handleSearch} />
        <Paper className={`box-container ${query ? '' : 'hide'}`}>
          <Tickets query={query} />
        </Paper>
      </div>
    );
  }
}

export default Home;
