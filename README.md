# pull-abortable

a pull-stream that may be aborted from the outside.

# example

``` js
var pull = require('pull-stream')
var Abortable = require('pull-abortable')

var abortable = Abortable()
pull(
  source,
  abortable,
  sink
)
//at any time you can abort the pipeline,
//the soruce will be cleaned up, and any
//error will be passed to the sink next time it reads.
atAnyTime(function () {
  abortable.abort()
})
```

## License

MIT
