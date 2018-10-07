// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

class Home extends React.Component {
  state: {
    querry: string,
    suggestions: Array<string>,
  } = {
    query: '',
    suggestions: [],
  };

  render() {
    const { query, suggestions } = this.state;

    return (
      <div className="search-container">
        <div className="searchbar-container">
          <input className="searchbar" placeholder="Search TicketHub" />
          <IconButton className="search-button">
            <SearchIcon />
          </IconButton>
        </div>
        <ul className="search-suggestions">
          {suggestions.map(suggestion => (
            <li>{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Home;
