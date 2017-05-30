import React, { Component } from 'react';
import { debounce } from 'lodash';
import Artist from '../models/Artist';
import './ArtistsSearch.css';


class ArtistsSearch extends Component {

  constructor(props) {
    
    super(props);
    this.state = {
      searchText: '',
      results: [],
      isSearching: false,
      error: null,
      searchOpen: false,
      indexSelected: -1
    };

    this.search = debounce(this.search, 200);

  }


  componentDidMount() {
    if (this.props.hasFocus)
      this.refs.input.focus();
  }


  componentWillUpdate(nextProps) {
    if (!this.props.hasFocus && nextProps.hasFocus)
      this.refs.input.focus();
  }


  search(text) {
    text = text.trim().replace(/\W+/g, ' ');

    if (this.state.searchedText === text.trim)
      return;

    if (this.state.isSearching)
      return this.search(text);
    
    this.setState({ searchedText: text, isSearching: true });
    Artist.search(text, this.onSearchCompleted.bind(this));
  }


  onSearchCompleted(err, result) {
    this.setState({
      isSearching: false,
      error: err,
      results: (result && result.artists) || []
    });
  }


  handleSearchFocus() {
    if (this.closeSearchTimeout) {
      clearTimeout(this.closeSearchTimeout);
      delete this.closeSearchTimeout;
    }

    this.setState({ searchOpen: true });
  }


  handleSearchBlur() {
    this.closeSearchTimeout = setTimeout(() => {
      this.setState({ searchOpen: false });
    }, 300);
  }


  handleSearchChange(e) {
    var searchText = e.target.value;
    this.setState({ searchText: searchText });
    this.search(searchText);
  }


  handleArtistClick(artist) {
    this.props.onArtistClick(artist);
    this.setState({ searchText: '', indexSelected: -1 });
  }


  handleKeyDown(e) {
    const Keys = {
      UP: 38,
      DOWN: 40,
      ENTER: 13
    }

    var resultsLength = this.state.results.length;
    if (e.keyCode === Keys.UP) {
      this.setState({ indexSelected: (this.state.indexSelected - 1 + resultsLength) % resultsLength });
      e.preventDefault();
    } else if (e.keyCode === Keys.DOWN) {
      this.setState({ indexSelected: (this.state.indexSelected + 1 + resultsLength) % resultsLength });
      e.preventDefault();
    } else if (e.keyCode === Keys.ENTER && this.state.indexSelected >= 0) {
      var artist = this.state.results[this.state.indexSelected];
      if (artist)
        this.handleArtistClick(artist);
    }
  }


  renderResults() {
    var searchResults = this.state.results.map((artist, i) => {
      var classNames = ['artists-search-result'];
      if (i === this.state.indexSelected)
        classNames.push('artists-search-result-selected');

      return (<li className={classNames.join(' ')} key={i} 
        onClick={this.handleArtistClick.bind(this, artist)}>
          {artist.name}
      </li>);
    });

    if (!searchResults.length)
      searchResults.push(<li className="artists-search-result no-result" key={0}>No result found</li>);

    if (this.state.error)
      searchResults.unshift(<li className="artists-search-result search-error" key="error">{this.state.error.message}</li>);

    return searchResults;
  }


  render() {
    var classNames = ['artists-search'];
    if (this.state.searchOpen && this.state.searchText)
      classNames.push('artists-search-open');

    return (
      <div className={classNames.join(' ')}>
        <h2 className="artists-search-prompt">Which artist do you want to listen?</h2>
        <input ref="input" className="artists-search-input" type="search" placeholder="artist name" 
          value={this.state.searchText}
          onFocus={this.handleSearchFocus.bind(this)}
          onBlur={this.handleSearchBlur.bind(this)}
          onChange={this.handleSearchChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)} />

        <ul className="artists-search-results">
          {this.renderResults()}
        </ul>
      </div>
    );
  }

}


export default ArtistsSearch;