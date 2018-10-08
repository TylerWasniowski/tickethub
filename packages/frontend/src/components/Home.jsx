// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SearchIcon from '@material-ui/icons/Search';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  state: {
    query: string,
    suggestions: Array<string>,
  } = {
    query: '',
    suggestions: [],
  };

  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { query, suggestions } = this.state;

    return (
      <div className="search-container">
        <div className="searchbar-container">
          <input
            className="searchbar"
            placeholder="Search TicketHub"
            onChange={this.handleQueryChange}
          />
          <IconButton className="search-button">
            <SearchIcon />
          </IconButton>
        </div>
        <List className="search-suggestions">
          {suggestions.map(suggestion => (
            <ListItem button className="search-suggestion">
              {suggestion}
            </ListItem>
          ))}
          <ListItem button className="search-suggestion">
            {query}
          </ListItem>
        </List>
      </div>
    );
  }
}

export default Home;
