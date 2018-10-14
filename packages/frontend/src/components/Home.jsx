// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SearchIcon from '@material-ui/icons/Search';
import BoxContainer from './BoxContainer';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.getSuggestionComponents = this.getSuggestionComponents.bind(this);
    this.getTicketComponents = this.getTicketComponents.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  state: {
    query: string,
    suggestions: Array<string>,
    tickets: Array<string>,
  } = {
    query: '',
    suggestions: [],
    tickets: [],
  };

  getSuggestionComponents() {
    const { suggestions } = this.state;

    return suggestions
      .slice(0, process.env.MAX_SUGGESTIONS)
      .map(suggestion => <ListItem button>{suggestion}</ListItem>);
  }

  getTicketComponents() {
    const { tickets } = this.state;

    return tickets.map(ticket => <ListItem>{ticket}</ListItem>);
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') this.handleSearch();
  }

  handleSearch() {
    const { query } = this.state;

    this.setState({ tickets: query.split(' ') });
  }

  render() {
    const { query, tickets } = this.state;

    return (
      <div className="home">
        <div className="search-container">
          <div className="searchbar-container">
            <input
              className="searchbar"
              placeholder="Search TicketHub"
              onChange={this.handleQueryChange}
              onKeyPress={this.handleKeyPress}
            />
            <IconButton className="search-button" onClick={this.handleSearch}>
              <SearchIcon />
            </IconButton>
          </div>
          <List className="search-suggestions">
            {this.getSuggestionComponents()}

            {/* Testing suggestions with query */}
            {query
              .split('')
              .sort(() => 0.5 - Math.random())
              .slice(
                Math.floor(Math.random() * process.env.MAX_SUGGESTIONS),
                process.env.MAX_SUGGESTIONS
              )
              .map(ch => (
                <ListItem button>{ch}</ListItem>
              ))}
          </List>
        </div>
        <BoxContainer
          className={tickets.length && tickets[0] !== '' ? '' : 'hide'}
        >
          <List>{this.getTicketComponents()}</List>
        </BoxContainer>
      </div>
    );
  }
}

export default Home;
