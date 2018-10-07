// @flow
import '../styles/home.css';
import React from 'react';
import type { Node } from 'react';

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
