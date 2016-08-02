module.exports = function (params) {
  return Object.keys(params).map(function (p) {
    return encodeURIComponent(p) + '=' + encodeURIComponent(params[p])
  }).join('&')
}