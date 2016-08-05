var React = require('react')

var SearchArtists = require('./search-artists.jsx')
var ArtistsList = require('./artists-list.jsx')
var Player = require('./player.jsx')

var SITE_NAME = 'Playlister'

module.exports = React.createClass({
  getInitialState: function () {
    var me = this
    var playlist = require('../models/playlist')
    var artistIds = window.location.hash.replace('#/', '').split('+')
    if (artistIds.length) {
      playlist.addArtist(artistIds, function () {
        me.setState({ playlist: playlist })
        me.askNextTrack()
      })
    }

    return {
      playlist: playlist,
      tracks: [],
      currentTrack: null,
      url: null,
      playing: true,
      volume: 0.2
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.currentTrack != this.state.currentTrack)
      this.updateDocumentTitle()
    this.updateLocation()
  },

  updateDocumentTitle: function () {
    var currentTrack = this.state.currentTrack
    if (currentTrack)
      document.title = currentTrack.artistName + ' - ' + currentTrack.title + ' | ' + SITE_NAME
    else
      document.title = SITE_NAME
  },

  updateLocation: function () {
    var artistsIds = this.state.playlist.artists.map(function (artist) {
      return artist.id
    }).join('+')
    window.location.hash = '/' + artistsIds
  },

  askNextTrack: function () {
    var me = this
    me.state.playlist.getNextTrack(function (track) {
      me.setState({ 
        tracks: me.state.tracks.concat(track),
        currentTrack: track
      })
    })
  },

  handleArtistClicked: function (artist) {
    var me = this
    me.state.playlist.addArtist(artist)
    me.setState({ playlist: me.state.playlist })

    if (!this.state.currentTrack)
      me.askNextTrack()
  },

  handleArtistRemove: function(artist) {
    this.state.playlist.removeArtist(artist)
    this.setState({ playlist: this.state.playlist })
  },

  togglePlay: function () {
    this.setState({ playing: !this.state.playing })
  },

  setVolume: function (val) {
    this.setState({ volume: +val })
  },

  render: function () {
    var tracks = this.state.tracks.map(function (track, i) {
      var sources = track.sources ? track.sources.map(function (source, j) {
        return <li key={j}><a href={source.link} target="_blank">{source.title}</a></li>
      }) : ''

      return <li key={i}>{track.artistName} - {track.title} <ul>{sources}</ul></li>
    })

    return (
      <div className="app">
        <div className="player-container">
          <Player 
            track={this.state.currentTrack} 
            playing={this.state.playing}
            volume={this.state.volume}
            onEnded={this.askNextTrack}
            onTogglePlayClick={this.togglePlay}
            onVolumeChange={this.setVolume} />
        </div>
        <div className="playlist-container">
          <ArtistsList artists={this.state.playlist.artists} onRemove={this.handleArtistRemove} />
          <SearchArtists onArtistClicked={this.handleArtistClicked}/>
          <div className="tracks">
            <h2>Tracks</h2>
            <ul>
              {tracks}
            </ul>
          </div>
        </div>
      </div>
    )
  }
})