var shuffle = require('shuffle-array')
var mb = require('../utils/musicbrainz')
var recording = require('./recording')

module.exports = function (props) {
  props.currentIndex = 0
  props.foundTitles = {}

  props.findAllTracks = function (callback) {
    mb.searchRecordings('arid:' + props.id + ' AND type:album', { limit: 1 }, function(err, result) {
      if (err)
        return setTimeout(function () { props.findAllTracks(callback) }, 1000)

      props.tracksCount = result.count
      props.shuffle()

      if (callback)
        callback()
    })
  }

  props.shuffle = function () {
    var tracks = []
    for (var i = 0; i < props.tracksCount; i++)
      tracks[i] = i
    props.tracks = shuffle(tracks)
  }

  props.getNextTrack = function (callback) {
    if (!props.tracks) {
      return props.findAllTracks(function () {
        props.getNextTrack(callback)
      })
    }

    var nextTrack = props.tracks[props.currentIndex]
    if (nextTrack === false) {
      // track with same title has been already found
      incrementIndex()
      return props.getNextTrack(callback)
    }

    if (nextTrack && isNaN(nextTrack)) {
      return setTimeout(function () {
        incrementIndex()
        callback(nextTrack)
      })
    }

    mb.searchRecordings('arid:' + props.id, { limit: 1, offset: nextTrack }, function (err, result) {
      if (err || !result || !result.recordings) {
        return setTimeout(function () {
          props.getNextTrack(callback)
        }, 1000)
      }

      var track = result.recordings[0]
      if (props.foundTitles[track.title]) {
        // set track index as already found title
        props.tracks[nextTrack] = false
        incrementIndex()
        return props.getNextTrack(callback)
      }

      track.artistId = props.id
      track.artistName = props.name
      track = recording(track)
      props.tracks[nextTrack] = track
      props.foundTitles[track.title] = track
      incrementIndex()
      callback(track)
    })
  }

  function incrementIndex() {
    props.currentIndex = (props.currentIndex + 1) % props.tracks.length
  }

  return props
}