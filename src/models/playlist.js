var mb = require('../utils/musicbrainz')
var Artist = require('./artist')

var artists = []

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
      if (!prevArtist)
        artists.push(artist)
      if (callback)
        setTimeout(function () { callback(artist) })
    }
    return me
  },

  removeArtist: function (artist) {
    var i = artists.indexOf(artist)
    if (i != -1)
      artists.splice(i, 1)
    return me
  },

  getNextTrack: function (callback) {
    var artistIndex = Math.floor(Math.random() * artists.length)
    var artist = artists[artistIndex]
    artist.getNextTrack(callback)
    return me
  }
}

function getArtistById(artistId) {
  for (var i = 0; i < artists.length; i++) {
    if (artists[i].id === artistId)
      return artists[i]
  }
  return null
}