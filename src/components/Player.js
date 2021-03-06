import ReactPlayer from 'react-player';
import React, { Component } from 'react';
import PlayerController from './PlayerController';
import './Player.css';



class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      currentTime: 0
    };
  }

  handlePlayClick() {
    this.props.onPlayClick();
  }


  handlePauseClick() {
    this.props.onPauseClick();
  }


  handlePrevClick() {
    if (this.state.currentTime > 2)
      this.refs.player.seekTo(0);
    else
      this.props.onPrevTrack();
  }


  handleSeek(e) {
    var time = e.target.value;
    this.refs.player.seekTo(time / this.state.duration);
  }


  handleProgress(val) {
    this.setState({ currentTime: this.state.duration * val.played });
  }


  handleDurationChange(duration) {
    this.setState({ duration: duration });
  }



  render() {

    var track = this.props.track;
    var trackUrl = track && track.sources[0].url;
    var nextTrack = this.props.nextTracks[0];

    return (
      <div className="player">
        <ReactPlayer className="player-video" 
          ref="player"
          url={trackUrl}
          youtubeConfig={{ playerVars: { playsinline: 1 } }}
          volume={this.props.volume}
          playing={this.props.playing}
          onEnded={this.props.onNextTrack}
          onError={this.props.onNextTrack}
          progressFrequency={100}
          onProgress={this.handleProgress.bind(this)}
          onDuration={this.handleDurationChange.bind(this)}
          onPlay={this.handlePlayClick.bind(this)}
          onPause={this.handlePauseClick.bind(this)}
          width="100%"
          height="100%" />
        
        <PlayerController 
          track={track}
          playing={this.props.playing}
          volume={this.props.volume}
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          onPlayClick={this.handlePlayClick.bind(this)}
          onPauseClick={this.handlePauseClick.bind(this)}
          onPrevClick={this.handlePrevClick.bind(this)}
          onNextClick={this.props.onNextTrack}
          onVolumeChange={this.props.onVolumeChange}
          onTimeChange={this.handleSeek.bind(this)} />
      </div>
    );

  }

}


export default Player;