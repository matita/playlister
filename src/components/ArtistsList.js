import React, { Component } from 'react';
import './ArtistsList.css';


function ArtistItem(props) {
  var artist = props.artist;

  return <li className="artists-list-item">
    <div className="artists-item-meta">
      <span className="artists-item-name">{artist.name}</span>
      <span className="artists-item-count" style={{display: 'none'}}>({artist.tracksCount || '?'})</span>
    </div>
    <div className="artists-item-actions">
      <button className="artists-item-more artists-item-action" onClick={props.onMoreClick}>+</button>
      <button className="artists-item-remove artists-item-action" onClick={props.onRemoveClick}>&times;</button>
    </div>
  </li>
}


class ArtistsList extends Component {

  handleRemoveClick(artist, e) {
    e.target.blur();
    this.props.onArtistRemoved(artist);
  }


  handleMoreClick(artist, e) {
    e.target.blur();
    this.props.onArtistMore(artist);
  }


  renderArtists() {
    var items = this.props.artists.map((a, i) => <ArtistItem key={i} 
      artist={a} 
      onRemoveClick={this.handleRemoveClick.bind(this, a)}
      onMoreClick={this.handleMoreClick.bind(this, a)} />);

    if (!items.length)
      items.push(<li className="artists-list-item no-artist" key={0}>No artist</li>);

    return items;
  }


  render() {
    

    return (
      <div className="artists-list">
        <ul className="artists-list-items">
          {this.renderArtists()}
        </ul>
      </div>
    );
  }

}


export default ArtistsList;