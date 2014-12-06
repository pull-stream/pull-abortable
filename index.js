function abortable(onEnd) {
  var aborted = false, reading = false, ended = false, _cb, _read

  function terminate (err) {
    if(onEnd) onEnd(ended === true ? null :  ended)
    var cb = _cb
    _cb = null
    if(cb) cb(ended)
  }

  function cancel () {
    if(reading) {
      return terminate(aborted)
    }
    
    terminate(ended = true)
    reading = true
    _read(aborted, function (err) {
      reading = false
    })
  }

  function reader (read) {
    _read = read
    return function (abort, cb) {
      _cb = cb
      if(abort)   aborted = abort
      if(ended)   return cb(ended)
      if(aborted) return // _cb = cb, cb = null, cancel()
      reading = true
      read(abort, function (end, data) {
        reading = false
        if(aborted) return
        if(!_cb) return
        var cb = _cb
        _cb = null
        if(end) {
          ended = end
          onEnd(ended === true ? null :  ended)
          console.log('CB', end)
          cb(end)
        }
        else {
          if(aborted) {
            console.log('ABORTED', end, data, reading)
          }
          cb(end, data)
          if(aborted && !ended && !reading) cancel()
        }
      })
    }
  }
  reader.abort = function () {
    console.log('ABORT!!!', ended, reading)
    aborted = true
    if(ended) return
    cancel()
  }

  return reader
}

module.exports = abortable

