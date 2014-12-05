var crypto = require('crypto')

var pull = require('pull-stream')
var rate = require('../rate')
function rand (n) {
  return ~~(Math.pow(2, Math.random()) * n)
}

pull(
  pull.count(1000),
  pull.asyncMap(function (d, cb) {
    setTimeout(function () {
      cb(null, crypto.randomBytes(rand(1000)).toString('hex'))
    }, rand(100))
  }),
  rate(),
  pull.drain(function (d) {
    process.stdout.write(d)
  })
)
