import React, { Component } from 'react';
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


  handleVolumeClick(e) {
    e.target.blur();
  }


  render() {
    var playBtn = this.props.playing ?
      <button className="pause-btn fa fa-pause" onClick={this.handlePauseClick.bind(this)}></button> :
      <button className="play-btn fa fa-play" onClick={this.handlePlayClick.bind(this)}></button>;

    return (
      <div className="player-controller">
        
        <button className="prev-btn fa fa-step-backward" onClick={this.handlePrevClick.bind(this)}></button>
        {playBtn}
        <button className="next-btn fa fa-step-forward" onClick={this.handleNextClick.bind(this)}></button>

        <input className="player-seekbar" type="range" min={0} max={this.props.duration} step={0.01}
          value={this.props.currentTime}
          onChange={this.props.onTimeChange} />
        <span className="player-controller-time">{this.getCurrentTime()} / {this.getDuration()}</span>

        <span className="player-volume-icon fa fa-volume-down"></span>
        <input className="player-volume-bar" type="range" min={0} max={1} step={0.01} 
          value={this.props.volume} 
          onClick={this.handleVolumeClick.bind(this)}
          onChange={this.handleVolumeChange.bind(this)} />

      </div>
    );

  }

}


export default PlayerController;