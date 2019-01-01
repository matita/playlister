import React, { Component } from 'react';
import Seekbar from './Seekbar';
import displayTime from '../utils/display-time';
import './PlayerController.css';


class PlayerController extends Component {

  getCurrentTime() {
    return displayTime(this.props.currentTime);
  }


  getDuration() {
    return displayTime(this.props.duration);
  }


  handlePauseClick(e) {
    e.target.blur();
    this.props.onPauseClick();
  }


  handlePlayClick(e) {
    e.target.blur();
    this.props.onPlayClick();
  }


  handlePrevClick(e) {
    e.target.blur();
    this.props.onPrevClick();
  }


  handleNextClick(e) {
    e.target.blur();
    this.props.onNextClick();
  }


  handleVolumeChange(e) {
    var vol = +e.target.value;
    this.props.onVolumeChange(vol);
  }


  handleSeekbarClick(e) {
    e.target.blur();
  }


  handleVolumeClick(e) {
    e.target.blur();
  }


  render() {
    const { track } = this.props;

    var playBtn = this.props.playing ?
      <button className="pause-btn fas fa-pause" onClick={this.handlePauseClick.bind(this)}></button> :
      <button className="play-btn fas fa-play" onClick={this.handlePlayClick.bind(this)}></button>;

    return (
      <div className="player-controller">
        <Seekbar value={this.props.currentTime} 
          total={this.props.duration} 
          style={{ position: 'absolute', bottom: '100%', left: 0, right: 0 }}
          onChange={this.props.onTimeChange} />
        
        <div className="player-controller-buttons">
          <button className="prev-btn fas fa-step-backward" onClick={this.handlePrevClick.bind(this)}></button>
          {playBtn}
          <button className="next-btn fas fa-step-forward" onClick={this.handleNextClick.bind(this)}></button>
        </div>

        <div className="player-track">{track ? track.sources[0].title : '---'}</div>

        <span className="player-controller-time">{this.getCurrentTime()} / {this.getDuration()}</span>

        <span className="player-volume-icon fas fa-volume-down"></span>
        <input className="player-volume-bar" type="range" min={0} max={1} step={0.01} 
          value={this.props.volume} 
          onClick={this.handleVolumeClick.bind(this)}
          onChange={this.handleVolumeChange.bind(this)} />

      </div>
    );

  }

}


export default PlayerController;