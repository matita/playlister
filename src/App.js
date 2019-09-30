import React, { Component } from 'react';
import './App.css';

import Artists from './components/Artists';
import Player from './components/Player';
import Artist from './models/artist';
import Tracks from './components/Tracks';

class App extends Component {

  constructor(props) {
    super(props);

    this.nextArtists = [];

    this.state = {
      preloadTracksCount: 2,
      artists: [],
      prevTracks: [],
      nextTracks: [],
      volume: (localStorage['playlister_volume'] && JSON.parse(localStorage['playlister_volume'])) || 0.2,
      currentTrack: null,
      playing: false
    }

    this.loadArtists();
    if (this.state.artists.length)
      this.findNextTrack();
  }


  componentDidMount() {
    window.onkeydown = this.onKeyDown.bind(this);
  }


  onKeyDown(e) {
    const excludedTags = ['INPUT', 'SELECT', 'TEXTAREA'];
    if (excludedTags.indexOf(e.target.tagName) !== -1)
      return;

    const Keys = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32,
      J: 74,
      K: 75,
      N: 78,
      P: 80
    };

    switch (e.keyCode) {
      case Keys.P:
      case Keys.K:
        this.playPrev(); 
        break;
      
      case Keys.N: 
      case Keys.J:
        this.playNext(); 
        break;

      case Keys.SPACE: 
        this.togglePlay(); 
        break;

      case Keys.UP:
        this.volumeUp();
        break;

      case Keys.DOWN:
        this.volumeDown();
        break;
    }
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


  togglePlay() {
    this.setState({ playing: !this.state.playing });
  }


  play() {
    this.setState({ playing: true });
  }


  pause() {
    this.setState({ playing: false });
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


  volumeUp() {
    this.handleVolumeChange(this.state.volume + 0.1);
  }


  volumeDown() {
    this.handleVolumeChange(this.state.volume - 0.1);
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


  handleVolumeChange(volume) {
    volume = Math.max(0, Math.min(volume, 1));
    if (volume === this.state.volume)
      return;

    localStorage['playlister_volume'] = JSON.stringify(volume);
    this.setState({ volume: volume });
  }


  render() {
    const { prevTracks, nextTracks, currentTrack, artists } = this.state;

    var classNames = ['App'];
    if (!artists.length)
      classNames.push('first-time');

    return (
      <div className={classNames.join(' ')}>
        <div className="header">
          <span className="app-name">Playlister</span> by <a href="https://github.com/matita" target="_blank" rel="noopener noreferrer">matita</a>
          {' '}&middot;{' '}
          <a href="https://github.com/matita/playlister" target="_blank" rel="noopener noreferrer"><span className="fab fa-github"></span> source</a>
        </div>

        <main>
          <div className="player-container">
            <Player track={this.state.currentTrack}
              playing={this.state.playing}
              volume={this.state.volume}
              nextTracks={this.state.nextTracks}
              onNextTrack={this.playNext.bind(this)}
              onPrevTrack={this.playPrev.bind(this)}
              onPlayClick={this.play.bind(this)}
              onPauseClick={this.pause.bind(this)}
              onVolumeChange={this.handleVolumeChange.bind(this)} />
            
            <Tracks prevTracks={prevTracks} currentTrack={currentTrack} nextTracks={nextTracks} />
          </div>

          <div className="artists-container">
            <Artists 
              artists={this.state.artists}
              onArtistSearched={this.handleArtistSearched.bind(this)}
              onArtistRemoved={this.handleArtistRemoved.bind(this)}
              onArtistMore={this.handleArtistMore.bind(this)} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
