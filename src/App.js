import React, { Component } from 'react';
import './App.css';

import Artists from './components/Artists';
import Player from './components/Player';
import Artist from './models/Artist';

class App extends Component {

  constructor(props) {
    super(props);

    this.nextArtists = [];

    this.state = {
      preloadTracksCount: 2,
      artists: [],
      prevTracks: [],
      nextTracks: [],
      currentTrack: null
    }

    this.loadArtists();
    if (this.state.artists.length)
      this.findNextTrack();
  }


  findNextTrack(artist) {
    if (!this.state.artists.length)
      return;

    if (!artist && this.state.nextTracks.length >= this.state.preloadTracksCount)
      return;

    if (!artist) {
      var artistIndex = Math.floor(Math.random()*this.state.artists.length);
      artist = this.state.artists[artistIndex];
    }

    artist.getNextTrack();
  }


  addArtist(artist) {
    if (this.state.artists.filter(a => a.id === artist.id).length)
      return;

    this.state.artists.push(artist);
    artist.onTracksCountFound = this.handleTracksCountFound.bind(this);
    artist.onTrackFound = this.handleTrackFound.bind(this);
  }


  loadArtists() {
    if (!localStorage['playlister_artists'])
      return [];

    JSON.parse(localStorage['playlister_artists'])
      .forEach(a => this.addArtist(new Artist(a)));
  }


  saveArtists() {
    var ser = this.state.artists.map(a => a.serialize());
    localStorage['playlister_artists'] = JSON.stringify(ser);
  }


  playNext() {
    if (this.state.currentTrack)
      this.state.prevTracks.push(this.state.currentTrack);

    this.setState({
      currentTrack: this.state.nextTracks.shift()
    });

    this.findNextTrack();
  }


  playPrev() {
    var prevTrack = this.state.prevTracks.pop();
    if (prevTrack) {
      this.state.nextTracks.unshift(this.state.currentTrack);
      this.setState({ currentTrack: prevTrack });
    }
  }


  handleArtistSearched(artist) {
    this.addArtist(artist);
    this.saveArtists();
    this.nextArtists.unshift(artist);
    this.findNextTrack(artist);

    this.setState({ artists: this.state.artists });
  }


  handleTracksCountFound(artist) {
    this.setState({ artists: this.state.artists });
  }


  handleTrackFound(artist, track) {
    // if the track is from a just searched artist then put it as next in the queue
    var nextArtistIndex = this.nextArtists.indexOf(artist);
    if (nextArtistIndex !== -1) {
      this.state.nextTracks.unshift(track);
      this.nextArtists.splice(nextArtistIndex, 1);
    } else
      this.state.nextTracks.push(track);

    var newState = {};
    if (!this.state.currentTrack)
      this.playNext();
    else
      this.setState({ nextTracks: this.state.nextTracks });

    setTimeout(() => {
      this.findNextTrack();
    }, 1000);
    
  }


  handleArtistRemoved(artist) {
    var index = this.state.artists.indexOf(artist);
    if (index === -1)
      return;

    this.state.artists.splice(index, 1);
    var tracksToRemove = this.state.nextTracks.filter(t => t.artistId === artist.id);
    tracksToRemove.forEach(t => {
      var i = this.state.nextTracks.indexOf(t);
      this.state.nextTracks.splice(i, 1);
    });

    this.saveArtists();

    this.setState({
      artists: this.state.artists,
      nextTracks: this.state.nextTracks
    });
  }


  handleArtistMore(artist) {
    this.nextArtists.unshift(artist);
    this.findNextTrack(artist);
  }


  render() {
    var classNames = ['App'];
    if (!this.state.artists.length)
      classNames.push('first-time');

    var tracks = this.state.nextTracks.map((track, i) => {
      return <li key={i}>
        {track.artistName} - {track.title}
      </li>;
    });

    return (
      <div className={classNames.join(' ')}>
        <div className="header">
          <span className="app-name">Playlister</span> by <a href="https://github.com/matita" target="_blank">matita</a>
          {' '}&middot;{' '}
          <a href="https://github.com/matita/playlister" target="_blank"><span className="fa fa-github"></span> source</a>
        </div>

        <main>
          <div className="artists-container">
            <Artists 
              artists={this.state.artists}
              onArtistSearched={this.handleArtistSearched.bind(this)}
              onArtistRemoved={this.handleArtistRemoved.bind(this)}
              onArtistMore={this.handleArtistMore.bind(this)} />
          </div>

          <div className="player-container">
            <ol className="tracks">
              {tracks}
            </ol>
            <Player track={this.state.currentTrack}
              nextTracks={this.state.nextTracks}
              onNextTrack={this.playNext.bind(this)}
              onPrevTrack={this.playPrev.bind(this)} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
