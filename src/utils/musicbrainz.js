var request = require('browser-request')
var encodeParams = require('./encode-params')
var asyncThrottle = require('./async-throttle')(1000)

var baseUrl = ' http://musicbrainz.org/ws/2/'

function api (endpoint, params, callback) {
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
  searchArtists: function (query, callback) {
    api('artist', { query: query, limit: 5 }, callback)
  },

  searchRecordings: function (query, params, callback) {
    params.query = query
    api('recording', params, callback)
  }
}