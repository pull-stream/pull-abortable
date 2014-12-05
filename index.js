function abortable(onEnd) {
  var aborted = false, reading = false, ended = false, _cb, _read

  function cancel () {
    if(reading) return
    reading = true
    _read(aborted, function (err) {
      reading = false
      ended = err || true
      if(onEnd) onEnd(ended === true ? null :  ended)
      if(_cb) _cb(ended)
    })
  }

  function reader (read) {
    _read = read
    return function (abort, cb) {
      if(abort) aborted = abort
      if(ended) return cb(ended)
      if(aborted) return _cb = cb, cancel()
      reading = true
      read(abort, function (end, data) {
        reading = false
        if(end) {
          ended = end
          onEnd(ended === true ? null :  ended)
          cb(end)
        }
        else {
          cb(end, data)
          if(aborted && !ended && !reading) cancel()
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

