var mb = require('../utils/musicbrainz')
var Artist = require('./artist')

var artists = []
var nextTracks = []

var me = module.exports = {
  artists: artists,
  
  addArtist: function (artist, callback) {
    if (typeof artist == 'object' && artist.push) {
      var query = artist.map(function (a) {
        return 'arid:' + a
      }).join(' OR ')
      mb.searchArtists(query, function(err, result) {
        result.artists.forEach(function(artist) {
          artists.push(Artist(artist))
        })
        callback()
      })
    } else if (typeof artist == 'string') {
      mb.getArtist(artist, function (result) {
        artist = Artist(result)
        artists.push(artist)
        callback(artist)
      })
    } else {
      var prevArtist = getArtistById(artist.id)
      if (!prevArtist) {
        artists.push(artist)
        // next track will be of the just added artist
        artist.getNextTrack(function (track) {
          nextTracks.unshift(track)
          me.onNextFound(nextTracks[0])
        })
      }
      if (callback)
        setTimeout(function () { callback(artist) })
    }
    return me
  },

  removeArtist: function (artist) {
    var i = artists.indexOf(artist)
    if (i != -1)
      artists.splice(i, 1)

    var nextTracksToRemove = nextTracks.filter(function (track) { return track.artistId === artist.id })
    for (i = 0; i < nextTracksToRemove.length; i++) {
      var trackI = nextTracks.indexOf(nextTracksToRemove[i])
      if (trackI != -1)
        nextTracks.splice(trackI, 1)
    }
    me.onNextFound(nextTracks[0])
    
    return me
  },

  getNextTrack: function (callback) {
    if (nextTracks.length) {
      callback(nextTracks.shift())
      me.peekNext()
    } else {
      me.peekNext(function (track) {
        me.getNextTrack(callback)
        //me.peekNext()
      })
    }
    
    return me
  },

  peekNext: function(callback) {
    var artistIndex = Math.floor(Math.random() * artists.length)
    var artist = artists[artistIndex]
    artist.getNextTrack(function (track) {
      nextTracks.push(track)
      if (callback)
        callback(track)
      else
        me.onNextFound(nextTracks[0])
    })
    return me
  },

  nextTrack: function () {
    return nextTracks[0]
  },

  onNextFound: function (track) {

  }
}

function getArtistById(artistId) {
  for (var i = 0; i < artists.length; i++) {
    if (artists[i].id === artistId)
      return artists[i]
  }
  return null
}