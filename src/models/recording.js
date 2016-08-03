var search = require('youtube-search')
var YT_KEY = 'AIzaSyDyZVX8On7QglmGjrarAAsr8aLnoWp9Lck'

module.exports = function (props) {

  props.getSources = function (callback) {
    if (props.sources)
      return setTimeout(function () { callback(props.sources) })

    var searchText = props.artistName + ' ' + props.title
    search(searchText, { maxResults: 5, type: 'video', key: YT_KEY }, function (err, results) {
      if (err)
        return callback(err)

      props.sources = results
      callback(null, results)
    })
  }

  return props
}