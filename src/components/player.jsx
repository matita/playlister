var React = require('react')
var ReactPlayer = require('react-player')

var displayTime = require('../utils/display-time')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      source: null,
      playing: this.props.playing,
      played: 0,
      duration: 0
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.track !== this.props.track)
      this.askSources()
    if (prevProps.playing !== this.props.playing)
      this.setState({ playing: this.props.playing })
  },

  askSources: function () {
    var me = this
    var track = me.props.track
    if (track) {
      track.getSources(function (err, sources) {
        if (err)
          return me.props.onEnded()
        if (sources.length)
          return me.setState({ source: sources[0] })
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

  handlePlayerPlay: function () {
    this.setState({ playing: true })
  },

  handlePlayerPause: function () {
    this.setState({ playing: false })
  },

  handleProgressChange: function (progress) {
    this.setState({ played: progress.played })
  },

  handleDuration: function (duration) {
    this.setState({ duration: duration })
  },

  render: function () {
    var track = this.props.track || {}
    var source = this.state.source || { title: '---', link: null }

    return (<div className="player">
      <div className="player-wrapper">
        <ReactPlayer 
          ref='player'
          className="player-div"
          width='100%'
          height='100%'
          url={source.link} 
          playing={this.state.playing} 
          volume={this.props.muted ? 0 : this.props.volume}
          onEnded={this.props.onEnded}
          onPlay={this.handlePlayerPlay}
          onPause={this.handlePlayerPause}
          onProgress={this.handleProgressChange}
          onDuration={this.handleDuration} />
      </div>
      <div className="player-source-title">{source.title}</div>
      <div className="player-track">
        <div className="player-track-title">{track.title || '---'}</div>
        <div className="player-track-artist">{track.artistName || '---'}</div>
      </div>
      <div className="player-controls">
        <button className="player-controls-play" onClick={this.props.onTogglePlayClick}>
          <i className={'fa fa-' + (this.state.playing ? 'pause' : 'play')}></i>
        </button>
        <button className="player-controls-next" disabled={this.props.askingNext} onClick={this.props.onEnded}>
          <i className={'fa fa-' + (this.props.askingNext ? 'spinner fa-spin' : 'step-forward')}></i>
        </button>
        <span className="player-controls-current-time">{this.getCurrentTime()}</span>
        <input type="range" className="player-controls-seekbar" min={0} max={1} step="any" value={this.state.played} onInput={this.handleSeekChange} onChange={this.endSeekChange} />
        <span className="player-controls-duration">{this.getDuration()}</span>
        <button className="player-controls-volume-btn" onClick={this.props.onToggleMuteClick}><i className={'fa fa-volume-' + (this.props.muted ? 'off' : 'down')}></i></button>
        <input type="range" className="player-controls-volumebar" min={0} max={1} step="any" value={this.props.volume} onInput={this.handleVolumeChange} onChange={this.handleVolumeChange} />
      </div>
    </div>)
  }
})