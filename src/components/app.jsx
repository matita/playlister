var React = require('react')

var SearchArtists = require('./search-artists.jsx')
var ArtistsList = require('./artists-list.jsx')
var Player = require('./player.jsx')
var HotKeys = require('react-hotkeys').HotKeys

var SITE_NAME = 'Playlister'

var keysMap = {
  'togglePlay': 'space',
  'nextTrack': 'right',
  'volumeUp': 'up',
  'volumeDown': 'down'
}

module.exports = React.createClass({
  getInitialState: function () {
    var me = this
    var playlist = require('../models/playlist')
    var artistIds = window.location.hash.replace('#/', '').split('+').filter(function (id) { return !!id })
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
      playing: true,
      askingNext: false,
      volume: 0.2,
      muted: false,
      searchIsFocused: !artistIds.length
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
    me.setState({ askingNext: true })
    me.state.playlist.getNextTrack(function (track) {
      me.setState({ 
        tracks: me.state.tracks.concat(track),
        currentTrack: track,
        askingNext: false
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
    var nextState = {
      playlist: this.state.playlist
    }
    if (this.state.currentTrack && this.state.currentTrack.artistName === artist.name) {
      nextState.currentTrack = null
      if (this.state.playlist.artists.length)
        this.askNextTrack()
    }
    this.setState(nextState)
  },

  togglePlay: function () {
    this.setState({ playing: !this.state.playing })
  },

  toggleMute: function () {
    this.setState({ muted: !this.state.muted })
  },

  setVolume: function (val) {
    this.setState({ 
      volume: Math.max(0, Math.min(+val, 1)),
      muted: false
    })
  },

  volumeUp: function () {
    this.setVolume(this.state.volume + 0.05)
  },

  volumeDown: function () {
    this.setVolume(this.state.volume - 0.05)
  },

  render: function () {
    var keysHandlers = {
      'togglePlay': this.togglePlay,
      'nextTrack': this.askNextTrack,
      'volumeUp': this.volumeUp,
      'volumeDown': this.volumeDown
    }

    var tracks = this.state.tracks.map(function (track, i) {
      var sources = track.sources ? track.sources.map(function (source, j) {
        return <li key={j}><a href={source.link} target="_blank">{source.title}</a></li>
      }) : ''

      return <li key={i}>{track.artistName} - {track.title} <ul>{sources}</ul></li>
    })

    return (
      <HotKeys keyMap={keysMap} handlers={keysHandlers}>
        <div className="app">
          <div className={'player-container' + (this.state.playlist.artists.length ? '' : ' hidden')}>
            <Player 
              track={this.state.currentTrack} 
              playing={this.state.playing}
              volume={this.state.volume}
              muted={this.state.muted}
              askingNext={this.state.askingNext}
              onEnded={this.askNextTrack}
              onTogglePlayClick={this.togglePlay}
              onToggleMuteClick={this.toggleMute}
              onVolumeChange={this.setVolume} />
          </div>
          <div className={'playlist-container' + (this.state.playlist.artists.length ? '' : ' maximized')}>
            <SearchArtists onArtistClicked={this.handleArtistClicked} focused={this.state.searchIsFocused} noArtistYet={this.state.playlist.artists.length == 0} />
            <ArtistsList artists={this.state.playlist.artists} onRemove={this.handleArtistRemove} />
            <div className="tracks">
              <h2>Tracks</h2>
              <ul>
                {tracks}
              </ul>
            </div>
          </div>
        </div>
      </HotKeys>
    )
  }
})