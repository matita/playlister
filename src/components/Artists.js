import React, { Component } from 'react';
import './Artists.css';
import ArtistsSearch from './ArtistsSearch';
import ArtistsList from './ArtistsList';
import ArtistsSuggestions from './ArtistsSuggestions';

class Artists extends Component {


  handleArtistClick(artist) {
    this.props.onArtistSearched(artist);
  }


  handleArtistRemoved(artist) {
    this.props.onArtistRemoved(artist);
  }


  handleArtistMore(artist) {
    this.props.onArtistMore(artist);
  }


  render() {
    return (
      <div className="artists">
        <ArtistsSearch 
          hasFocus={this.props.artists.length === 0} 
          onArtistClick={this.handleArtistClick.bind(this)} />

        <ArtistsSuggestions artists={this.props.artists} />

        <ArtistsList artists={this.props.artists} 
          onArtistRemoved={this.handleArtistRemoved.bind(this)} 
          onArtistMore={this.handleArtistMore.bind(this)} />
      </div>
    );
  }

}


export default Artists;