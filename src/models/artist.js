var shuffle = require('shuffle-array')
var mb = require('../utils/musicbrainz')
var recording = require('./recording')

module.exports = function (props) {
  props.currentIndex = 0
  props.foundTitles = {}

  var prevTracks = []
  var nextTracks = []
  var trackIndexesToAsk = []
  var isSearchingAllTracks = false
  
  props.findAllTracks = function (callback) {
    if (isSearchingAllTracks)
      return setTimeout(function () { props.findAllTracks(callback) }, 100)

    if ('tracksCount' in props)
      return callback()

    isSearchingAllTracks = true
    mb.searchRecordings('arid:' + props.id + ' AND type:album', { limit: 1 }, function(err, result) {
      if (err)
        return setTimeout(function () { props.findAllTracks(callback) }, 1000)

      isSearchingAllTracks = false
      props.tracksCount = result.count
      props.shuffle()

      if (callback)
        callback()
    })
  }

  props.shuffle = function () {
    for (var i = 0; i < props.tracksCount; i++)
      trackIndexesToAsk[i] = i
    trackIndexesToAsk = shuffle(trackIndexesToAsk)
  }

  props.getNextTrack = function (callback) {
    if (!('tracksCount' in props)) {
      return props.findAllTracks(function () {
        props.getNextTrack(callback)
      })
    }

    if (props.tracksCount === 0) {
      return setTimeout(function () { callback(null); });
    }

    if (!trackIndexesToAsk.length && !prevTracks.length) {
      // artist is taken from localStorage and still has to be intialized
      props.shuffle();
    }

    // get next track from the queue
    var nextTrack = nextTracks.shift()
    if (nextTrack) {
      prevTracks.push(nextTrack)
      return callback(nextTrack)
    }
    
    // no track in the queue, asking a new one
    var trackIndex = trackIndexesToAsk.shift()
    if (!isNaN(trackIndex)) {
      return askTrack(trackIndex, function () {
        props.getNextTrack(callback)
      })
    }

    // no other track to ask, repeat the playlist
    var prevTrack = prevTracks.shift()
    nextTracks.push(prevTrack)
    props.getNextTrack(callback)
  }

  function askTrack (offset, callback) {
    mb.searchRecordings('arid:' + props.id, { limit: 1, offset: offset }, function (err, result) {
      if (err || !result || !result.recordings) {
        return setTimeout(function () {
          props.askTrack(offset, callback)
        }, 1000)
      }

    
      var track = result.recordings[0]
      if (props.foundTitles[track.title]) {
        return callback(track)
      }

      props.foundTitles[track.title] = track
      track.artistId = props.id
      track.artistName = props.name
      track = recording(track)
      nextTracks.push(track)
      callback(track)
    })
  }

  return props
}