var request = require('browser-request')
var encodeParams = require('./encode-params')
var asyncThrottle = require('./async-throttle')(1000)

var baseUrl = ' http://musicbrainz.org/ws/2/'

function api (endpoint, params, callback) {
  if (typeof params == 'function') {
    callback = params
    params = {}
  }
  params = params || {}
  params.fmt = 'json'
  var url = baseUrl + endpoint + '?' + encodeParams(params)
  //asyncThrottle.enqueue(function () {
    //var done = asyncThrottle.async()
    request({ uri: url, json: true }, function (err, response, body) {
      //done()
      if (err)
        return api(endpoint, params, callback)

      callback(err, body)
    })
  //})
}

module.exports = {
  getArtist: function(artistId, callback) {
    api('artist/' + encodeURIComponent(artistId), callback)
  },

  searchArtists: function (query, params, callback) {
    if (typeof params === 'function') {
      callback = params
      params = { limit: 5 }
    }
    params.query = query
    api('artist', params, callback)
  },

  searchRecordings: function (query, params, callback) {
    params.query = query
    api('recording', params, callback)
  }
}