var search = require('youtube-search')
var yt = require('../utils/youtube-api')
var YT_KEY = 'AIzaSyDyZVX8On7QglmGjrarAAsr8aLnoWp9Lck'
var durationToSeconds = require('../utils/iso8601-seconds')

module.exports = function (props) {

  props.getSources = function (callback) {
    if (props.sources)
      return setTimeout(function () { callback(null, props.sources) })

    var searchText = props.artistName + ' ' + props.title
    search(searchText, { maxResults: 5, type: 'video', key: YT_KEY }, function (err, results) {
      if (err)
        return callback(err)

      var ids = results.map(function(r) { return r.id })
      yt.getDetails(ids, function(err, result) {
        if (err)
          return callback(err)

        result.items.forEach(mergeParts(results))
        props.sources = results
          .map(withScore)
          .sort(sortByScore)
        callback(null, props.sources)
      })
    })
  }

  function getDurationDelta(v) {
    var videoDuration = durationToSeconds(v.contentDetails.duration) * 1000
    return Math.abs(videoDuration - props.length)
  }

  function withScore(source) {
    var sourceTitle = source.title.toLowerCase()
    var recordingTitle = props.title.toLowerCase()

    var sourceHasLyrics = sourceTitle.indexOf('lyrics') !== -1
    var recordingHasLyrics = recordingTitle.indexOf('lyrics') !== -1
    var lyricsScore = sourceHasLyrics && !recordingHasLyrics ? 100 : 0

    var sourceIsLive = sourceTitle.indexOf('live') !== -1
    var recordingIsLive = recordingTitle.indexOf('live') !== -1
    var liveScore = sourceIsLive && !recordingIsLive ? -100 : 0

    var durationDelta = getDurationDelta(source) / 1000
    var durationScore = isNaN(props.length) ? 0 : 50 / (durationDelta || 1)

    source.score = lyricsScore + liveScore + durationScore
    
    return source
  }

  function sortByScore(s1, s2) {
    return s2.score - s1.score
  }

  function sortByDuration(v1, v2) {
    var delta1 = getDurationDelta(v1)
    var delta2 = getDurationDelta(v2)
    return delta1 - delta2
  }

  return props
}

function mergeParts(items) {
  return function (item) {
    var id = item.id
    for (var i = 0; i < items.length; i++) {
      if (items[i].id !== id)
        continue
      items[i].contentDetails = item.contentDetails
    }
  }
}