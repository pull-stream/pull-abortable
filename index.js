function abortable() {
  var aborted = false, reading = false, ended = false, _cb, _read

  function cancel () {
    reading = true
    _read(aborted, function (err) {
      reading = false
      ended = err || true
      if(_cb) _cb(err)
    })

  }

  function reader (read) {
    _read = read
    return function (abort, cb) {
      if(abort) aborted = abort
      if(ended) return cb(ended)
      if(reading) return _cb = cb
      reading = true
      read(abort, function (end, data) {
        if(end) ended = end
        reading = false
        cb(end, data)
        if(aborted && !ended && !reading) cancel()
      })
    }
  }
  reader.abort = function () {
    aborted = true
    if(ended) return
    if(!reading) cancel()
  }

  return reader
}

module.exports = abortable

