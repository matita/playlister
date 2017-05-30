var MINUTE = 60
var HOUR = 60 * MINUTE
var DAY = 24 * HOUR
var MONTH = 30 * DAY
var YEAR = 365 * DAY

export default function (durationStr) {
  var re = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(\.\d+)?)S)?/
  var match = durationStr.match(re)
  var y = +match[1] * YEAR || 0
  var M = +match[2] * MONTH || 0
  var d = +match[3] * DAY || 0
  var h = +match[4] * HOUR || 0
  var m = +match[5] * MINUTE || 0
  var s = +match[6] || 0
  return y + M + d + h + m + s
};