var http = require('http')

module.exports = function (url, callback) {
  http.get(url, function (res) {
    if (res.statusCode != 200)
      return callback('Status code: ' + res.statusCode)
    
    var result = ''
    res.on('data', function (chunk) {
      result += chunk
    })

    res.on('end', function () {
      callback(null, result)
    })
  })
}