import React from 'react';
import './Tracks.css';

const TrackItem = (track) => (
    <div className={'tracks-item' + (track.isPlaying ? ' playing' : '')}>
        <span className="tracks-item-artist">{track.artistName}</span>
        <span className="tracks-item-title">{track.title}</span>
        <div className="tracks-item-source">
            <i className="fab fa-youtube"></i>
            {' ' + track.sources[0].title}
        </div>
    </div>
);

export default ({ prevTracks, currentTrack, nextTracks }) => (
    <div className="tracks">
        {prevTracks.concat(currentTrack ? [{ ...currentTrack, isPlaying: true }] : []).concat(nextTracks)
            .map(TrackItem)}
    </div>
);