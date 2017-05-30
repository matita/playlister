import { shuffle } from 'lodash';
import MusicBrainz from '../api/MusicBrainz';
import Recording from './Recording';


class Artist {

  constructor(props) {

    this.id = props.id;
    this.name = props.name;
    this.disambiguation = props.disambiguation;

    this.indexesToSearch = null;
    this.prevIndexes = [];
    this.foundTracks = [];
  
    this.onTracksCountFound = props.onTracksCountFound || function () {};
    this.onTrackFound = props.onTrackFound || function () {};
  }


  findTracksCount(callback) {
    this.isSearchingAllTracks = true; 
    MusicBrainz.searchRecordings('arid:' + this.id + ' AND type:album', { limit: 1 }, (err, result) => {
      if (err)
        return setTimeout(() => { this.findTracksCount(callback) }, 1000)

      delete this.isSearchingAllTracks;
      this.tracksCount = result.count;
      this.onTracksCountFound(this, this.tracksCount);

      if (callback)
        callback()
    })
  }


  shuffle(callback) {
    if (!this.hasOwnProperty('tracksCount'))
      return this.findTracksCount(this.getNextTrack.bind(this));

    var indexesToSearch = [];
    for (var i = 0; i < this.tracksCount; i++)
      indexesToSearch.push(i);

    this.indexesToSearch = shuffle(indexesToSearch);
    callback();
  }


  getNextTrack() {
    if (!this.hasOwnProperty('tracksCount'))
      return this.findTracksCount(this.getNextTrack.bind(this));

    if (this.tracksCount === 0)
      return;

    if (!this.indexesToSearch)
      return this.shuffle(this.getNextTrack.bind(this));

    if (!this.indexesToSearch.length) {
      this.indexesToSearch = shuffle(this.prevIndexes);
      this.prevIndexes = [];
    }

    var index = this.indexesToSearch.shift();
    this.prevIndexes.push(index);
    this.askTrack(index);
  }


  askTrack(offset) {
    if (!this.foundTracks[offset])
      return this.askTracksPage(offset, this.askTracksPage.bind(this, offset));

    var track = this.foundTracks[offset];
    if (!track.sources) {

      track.searchSources(err => {
        if (err)
          return this.getNextTrack();

        this.askTrack(offset);
      })

    } else if (track.sources.length === 0) {
      this.getNextTrack();
    } else {
      this.onTrackFound(this, track);
    }
  }


  askTracksPage(offset, callback) {
    if (this.isAskingTrack)
      return;

    this.isAskingTrack = true;
    var pageSize = 50;
    var page = Math.floor(offset / pageSize);
    var startOffset = page * pageSize;

    MusicBrainz.searchRecordings('arid:' + this.id, { limit: pageSize, offset: page * pageSize }, (err, result) => {
      this.isAskingTrack = false;

      // retry to ask if it fails
      if (err || !result || !result.recordings) {
        return setTimeout(() => {
          this.askTrack(offset)
        }, 1000)
      }


      result.recordings
        .map(t => new Recording(t))
        .forEach((track, i) => {
          track.artistId = this.id;
          track.artistName = this.name;
          this.foundTracks[i + startOffset] = track
        });


      this.askTrack(offset);
    });
  }


  serialize() {
    return {
      id: this.id,
      name: this.name,
      disambiguation: this.disambiguation
    };
  }

}


Artist.search = function (query, callback) {
  MusicBrainz.searchArtists(query, function (err, result) {
    if (result && result.artists)
      result.artists = result.artists.map(artist => new Artist(artist));

    callback(err, result);
  })
}


export default Artist;