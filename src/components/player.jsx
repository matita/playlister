var React = require('react')
var ReactPlayer = require('react-player')

var displayTime = require('../utils/display-time')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      url: null,
      played: 0,
      duration: 0
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.track !== this.props.track)
      this.askSources()
  },

  askSources: function () {
    var me = this
    var track = me.props.track
    if (track) {
      track.getSources(function (err, sources) {
        if (sources.length)
          return me.setState({ url: sources[0].link })
        me.props.onEnded()
      })
    }
  },

  getCurrentTime: function () {
    var time = this.state.duration ? this.state.duration * this.state.played : 0
    return displayTime(time)
  },

  getDuration: function () {
    return displayTime(this.state.duration || 0)
  },

  handleVolumeChange: function (ev) {
    this.props.onVolumeChange(ev.target.value)
  },

  handleSeekChange: function (ev) {
    this.setState({ played: ev.target.value })
  },

  endSeekChange: function (ev) {
    var fraction = ev.target.value
    this.setState({ played: fraction })
    this.refs.player.seekTo(fraction)
  },

  handleProgressChange: function (progress) {
    this.setState({ played: progress.played })
  },

  handleDuration: function (duration) {
    this.setState({ duration: duration })
  },

  render: function () {
    var track = this.props.track || {}

    return (<div className="player">
      <ReactPlayer 
        ref='player'
        className="player-div"
        url={this.state.url} 
        playing={this.props.playing} 
        volume={this.props.volume}
        onEnded={this.props.onEnded}
        onProgress={this.handleProgressChange}
        onDuration={this.handleDuration} />
      <div className="player-track">
        <div className="player-track-title">{track.title || '---'}</div>
        <div className="player-track-artist">{track.artistName || '---'}</div>
      </div>
      <div className="player-controls">
        <button className="player-controls-play" onClick={this.props.onTogglePlayClick}>{this.props.playing ? 'Pause' : 'Play'}</button>
        <button className="player-controls-next" disabled={this.props.askingNext} onClick={this.props.onEnded}>{this.props.askingNext ? 'Loading' : 'Next'}</button>
        <span className="player-controls-current-time">{this.getCurrentTime()}</span>
        <input type="range" min={0} max={1} step="any" value={this.state.played} onInput={this.handleSeekChange} onChange={this.endSeekChange} />
        <span className="player-controls-duration">{this.getDuration()}</span>
        <input type="range" min={0} max={1} step="any" value={this.props.volume} onInput={this.handleVolumeChange} onChange={this.handleVolumeChange} />
      </div>
    </div>)
  }
})