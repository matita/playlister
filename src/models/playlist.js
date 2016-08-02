var artists = []

module.exports = {
  artists: artists,
  
  addArtist: function (artist) {
    artists.push(artist)
  },

  removeArtist: function (artist) {
    var i = artists.indexOf(artist)
    if (i != -1)
      artists.splice(i, 1)
  },

  getNextTrack: function (callback) {
    var artistIndex = Math.floor(Math.random() * artists.length)
    var artist = artists[artistIndex]
    artist.getNextTrack(callback)
  }
}