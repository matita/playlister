module.exports = function (timeoutMs) {
  var queue = []
  var dequeueIntervalId = 0
  var isDoingAsync = false

  var me = {
    enqueue: function (fn) {
      queue.push(fn)
      me.start()
    },

    start: function () {
      if (isDoingAsync || dequeueIntervalId)
        return

      dequeueIntervalId = setInterval(dequeue, timeoutMs)
    },

    async: function () {
      if (dequeueIntervalId) {
        clearInterval(dequeueIntervalId)
        dequeueIntervalId = 0
      }
      isDoingAsync = true

      return function () {
        isDoingAsync = false
        dequeueIntervalId = setInterval(dequeue, timeoutMs)
      }
    }
  }

  function dequeue() {
    var fn = queue.shift()
    if (fn)
      fn()
  }

  return me
}