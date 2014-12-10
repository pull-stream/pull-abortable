function abortable(onEnd) {
  var aborted = false, reading = false, ended = false, _cb, _read

  function terminate (err) {
    if(onEnd) onEnd(ended === true ? null :  ended)
    var cb = _cb; _cb = null
    if(cb) cb(ended)
  }

  function cancel () {
    ended = ended || true
    terminate(aborted || ended)
    if(!reading) {
      reading = true
      _read(aborted, function (err) {
        reading = false
      })
    }
  }

  function reader (read) {
    _read = read
    return function (abort, cb) {
      _cb = cb
      if(abort)   aborted = abort
      if(ended)   return cb(ended)
      if(aborted) return
      reading = true
      read(abort, function (end, data) {
        reading = false
        if(aborted) return !abort && read(aborted, function () {})
        if(!_cb) return
        var cb = _cb
        _cb = null
        if(end) {
          ended = end
          onEnd(ended === true ? null :  ended)
          cb(end)
        }
        else {
          cb(end, data)
        }
      })
    }
  }

  reader.abort = function () {
    aborted = true
    if(ended) return
    cancel()
  }

  return reader
}

module.exports = abortable

