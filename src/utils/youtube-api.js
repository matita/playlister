var request = require('browser-request')
var YT_KEY = 'AIzaSyDyZVX8On7QglmGjrarAAsr8aLnoWp9Lck'

var baseUrl = 'https://www.googleapis.com/youtube/v3/videos'

module.exports = {
  getDetails: function(ids, callback) {
    var url = baseUrl + '?id=' + ids.join(',') + '&part=contentDetails&key=' + YT_KEY
    request({ uri: url, json: true }, function (err, response, body) {
      callback(err, body)
    })
  }
}