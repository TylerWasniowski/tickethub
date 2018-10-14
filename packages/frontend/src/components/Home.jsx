// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import BoxContainer from './BoxContainer';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.getSuggestionComponents = this.getSuggestionComponents.bind(this);
    this.handleSuggestion = this.handleSuggestion.bind(this);

    this.getTicketComponents = this.getTicketComponents.bind(this);
    this.updateSuggestions = this.updateSuggestions.bind(this);

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

  getSuggestionComponents(): Array<Node> {
    const { suggestions } = this.state;

    return suggestions.slice(0, process.env.MAX_SUGGESTIONS).map(suggestion => (
      <ListItem onClick={() => this.handleSuggestion(suggestion)} button>
        <ListItemText>{suggestion}</ListItemText>
      </ListItem>
    ));
  }

  handleSuggestion(suggestion) {
    this.setState({ query: suggestion }, () => {
      this.handleSearch();
      this.updateSuggestions();
    });
  }

  getTicketComponents(): Array<Node> {
    const { tickets } = this.state;

    return tickets.map(ticket => <ListItem>{ticket}</ListItem>);
  }

  updateSuggestions() {
    const { query } = this.state;

    // Only for testing suggestions.
    // TODO: Make call to backend for suggestions
    this.setState({
      suggestions: query
        .split('')
        .sort(() => 0.5 - Math.random())
        .slice(
          Math.floor(Math.random() * process.env.MAX_SUGGESTIONS),
          process.env.MAX_SUGGESTIONS
        ),
    });
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value }, this.updateSuggestions);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') this.handleSearch();
  }

  handleSearch() {
    const { query } = this.state;

    this.setState({ tickets: query.split(' ') });
  }

  render(): Node {
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
              value={query}
            />
            <IconButton className="search-button" onClick={this.handleSearch}>
              <SearchIcon />
            </IconButton>
          </div>
          <List className="search-suggestions">
            {this.getSuggestionComponents()}
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
