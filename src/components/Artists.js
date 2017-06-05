import React, { Component } from 'react';
import './Artists.css';
import ArtistsSearch from './ArtistsSearch';
import ArtistsList from './ArtistsList';
import ArtistsSuggestions from './ArtistsSuggestions';

class Artists extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };
  }


  handleArtistClick(artist) {
    this.props.onArtistSearched(artist);
  }


  handleSearchChange(searchText) {
    this.setState({ searchText: searchText });
  }


  handleArtistRemoved(artist) {
    this.props.onArtistRemoved(artist);
  }


  handleArtistMore(artist) {
    this.props.onArtistMore(artist);
  }


  handleSimilarClick(artistName) {
    this.setState({ searchText: artistName });
  }


  render() {
    return (
      <div className="artists">
        <ArtistsSearch 
          searchText={this.state.searchText}
          hasFocus={this.props.artists.length === 0 || !!this.state.searchText} 
          onArtistClick={this.handleArtistClick.bind(this)}
          onSearchChange={this.handleSearchChange.bind(this)} />

        <ArtistsSuggestions artists={this.props.artists}
          onSimilarClick={this.handleSimilarClick.bind(this)} />

        <ArtistsList artists={this.props.artists} 
          onArtistRemoved={this.handleArtistRemoved.bind(this)} 
          onArtistMore={this.handleArtistMore.bind(this)} />
      </div>
    );
  }

}


export default Artists;