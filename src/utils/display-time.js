var MINUTE = 60
var HOUR = MINUTE * 60

module.exports = function (seconds) {
  var hh = Math.floor(seconds / HOUR)
  var mm = Math.floor((seconds - hh*HOUR) / MINUTE)
  var ss = Math.floor(seconds % MINUTE)

  if (hh)
    return hh + ':' + pad(mm) + ':' + pad(ss)
  return mm + ':' + pad(ss)
}

function pad(val) {
  return ('0' + val).substr(-2)
}