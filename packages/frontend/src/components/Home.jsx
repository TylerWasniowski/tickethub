// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';

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
    const home = this;
    const { query } = home.state;

    if (query) {
      fetch(`search/suggestions/${query}`)
        .then(res => res.json())
        .then(suggestions => home.setState({ suggestions }))
        .catch(alert);
    } else {
      home.setState({ suggestions: [] });
    }
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
        <Paper
          className={`box-container ${
            tickets.length && tickets[0] !== '' ? '' : 'hide'
          }`}
        >
          <List>{this.getTicketComponents()}</List>
        </Paper>
      </div>
    );
  }
}

export default Home;
