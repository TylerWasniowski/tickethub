// @flow
import '../styles/home.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { error } from 'util';
import { SearchSuggestionsRoute } from '../routes';

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
    id: number,
    suggestionsId: number,
  } = {
    query: '',
    suggestions: [],
    tickets: [],
    id: 0,
    suggestionsId: 0,
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
    this.handleQueryChange(
      { target: { value: suggestion } },
      this.handleSearch
    );
  }

  getTicketComponents(): Array<Node> {
    const { tickets } = this.state;

    return tickets.map(ticket => (
      <TableRow hover>
        <TableCell>{ticket}</TableCell>
        <TableCell>$42.42</TableCell>
      </TableRow>
    ));
  }

  async updateSuggestions() {
    const { query, id } = this.state;

    let suggestions;
    if (query.trim()) {
      suggestions = await fetch(SearchSuggestionsRoute(query))
        .then(res => (res.ok ? res.json() : []))
        .catch(err => {
          console.log(err);
          return [];
        });
    } else {
      suggestions = [];
    }

    // Check if suggestions are more recent than old suggestions
    const { suggestionsId } = this.state;
    if (id > suggestionsId) this.setState({ suggestions, suggestionsId: id });
  }

  handleQueryChange(event, callback) {
    const { id } = this.state;
    this.setState({ query: event.target.value }, () => {
      this.setState({ id: id + 1 }, () => {
        if (callback) callback();
        this.updateSuggestions();
      });
    });
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
          <Paper className="table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seat</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.getTicketComponents()}</TableBody>
            </Table>
          </Paper>
        </Paper>
      </div>
    );
  }
}

export default Home;
