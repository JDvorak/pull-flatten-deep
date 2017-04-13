const pull = require('pull-stream')

module.exports = pullFlattenDeep
// Pull-stream which recursively flattens streams of streams
function pullFlattenDeep () {
  var stack = []
  var _stack = []

  return function (read) {
    var _read
    if (!read) {
      throw new Error('No read provided to pull-flatten-deep.')
    }

    return function (err, cb) {
      if (err) {
        abortAll(err, cb)
      } else if (_read == null && _stack.length <= 0) {
        nextStream()
      } else if (!_read && _stack.length > 0) {
        _read = _stack.pop()
        nextChunk()
      } else {
        nextChunk()
      }

      function abortAll (abort) {
        while (_read || read) {
          if (_read) {
            _read(abort, function (err) {
              if (err) {
                read && read(err || abort, cb)
              }
            })
          } else {
            read(abort, cb)
          }
          _read = _stack.pop()
          read = stack.pop()
        }
      }

      function nextChunk () {
        _read(null, function (err, data) {
          if (err === true) {
            nextStream()
          } else if (err) {
            read(true, function () {
              cb(err)
            })
          } else if (data && typeof data === 'object' && data[0] === 'function') {
            _stack.push(_read)
            stack.push(read)
            read = pull.values(data)
            nextStream()
          } else if (typeof data === 'function') {
            _stack.push(_read)
            stack.push(read)
            read = pull.once(data)
            nextStream()
          } else {
            cb(null, data)
          }
        })
      }

      function nextStream () {
        _read = null

        read(null, function (end, stream) {
          if (end && stack.length <= 0) {
            return cb(end)
          } else if (end === true) {
            _read = _stack.pop()
            read = stack.pop()
            return nextChunk()
          }

          if (Array.isArray(stream) || (stream && typeof stream === 'object')) {
            stream = pull.values(stream)
          } else if (typeof stream !== 'function') {
            stream = pull.once(stream)
          }

          _read = stream
          nextChunk()
        })
      }
    }
  }
}
