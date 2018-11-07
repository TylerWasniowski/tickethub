// @flow
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';

import { SearchSuggestionsRoute } from '../routes';

type Props = {
  onSearch: search => void,
};

class Search extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.getSuggestionComponents = this.getSuggestionComponents.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
    this.updateSuggestions = this.updateSuggestions.bind(this);

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  state: {
    query: string,
    suggestions: Array<string>,
    updateCount: number,
    lastUpdate: number,
  } = {
    query: '',
    suggestions: [],
    updateCount: 0,
    lastUpdate: 0,
  };

  handleSuggestionClick(event) {
    this.updateQuery(event.target.innerText, this.handleSearch);
  }

  async updateSuggestions() {
    const { query, updateCount } = this.state;

    let suggestions;
    if (query) {
      suggestions = await fetch(SearchSuggestionsRoute(query))
        .then(res => res.json())
        .catch(alert);
    } else {
      suggestions = [];
    }

    // Check if suggestions are more recent than old suggestions
    const { lastUpdate } = this.state;
    if (updateCount > lastUpdate)
      this.setState({ suggestions, lastUpdate: updateCount });
  }

  getSuggestionComponents(): Array<Node> {
    const { suggestions } = this.state;

    return suggestions.slice(0, process.env.MAX_SUGGESTIONS).map(suggestion => (
      <ListItem onClick={this.handleSuggestionClick} button>
        <ListItemText>{suggestion}</ListItemText>
      </ListItem>
    ));
  }

  handleQueryChange(event) {
    this.updateQuery(event.target.value);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') this.handleSearch();
  }

  updateQuery(query, callback) {
    this.setState({ query }, () => {
      const { updateCount } = this.state;
      this.setState({ updateCount: updateCount + 1 }, () => {
        if (callback) callback();
        this.updateSuggestions();
      });
    });
  }

  handleSearch() {
    const { onSearch } = this.props;
    const { query } = this.state;

    onSearch(query);
  }

  render(): Node {
    const { query } = this.state;

    return (
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
    );
  }
}

export default Search;
