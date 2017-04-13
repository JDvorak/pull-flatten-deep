const test = require('tape')
const pull = require('pull-stream')
const flattenDeep = require('./')

test('should flatten any set of nested values', function (t) {
  t.plan(1)
  pull(
    pull.values([1, 2, pull.values([3, 4, pull.values([5, 6]), 7, 8, pull.values([9, 10, pull.values([11, 12])])])]),
    flattenDeep(),
    pull.collect(function (err, all) {
      if (err) {
        throw err
      }
      t.assert(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].toString(), 'Order is preserved')
    })
  )
})

test('should flatten any set of nested arrays', function (t) {
  t.plan(1)
  pull(
    pull.values([1, 2, [3, 4, [5, 6], 7, 8, [9, 10, [11, 12]]]]),
    flattenDeep(),
    pull.collect(function (err, all) {
      if (err) {
        throw err
      }
      t.assert(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].toString(), 'Order is preserved')
    })
  )
})

test('should flatten any set of nested maps', function (t) {
  t.plan(1)
  pull(
    pull.count(9),
    pull.map(function (ea) {
      return pull(pull.values([ea]), pull.map(function (ea) {
        return pull(pull.values([ea]), pull.map(function (ea) {
          return pull(pull.values([ea]), pull.map(function (ea) {
            return ea + 1
          }))
        }))
      }))
    }),
    flattenDeep(),
    pull.collect(function (err, all) {
      if (err) {
        throw err
      }
      t.assert(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].toString(), 'Order is preserved')
    })
  )
})

function randomDelay (abort) {
  return pull.asyncMap(function (ea, cb) {
    var delay = Math.floor(Math.random() * 100)
    setTimeout(function () {
      cb(abort, ea)
    }, delay)
  })
}

test('should be robust against asynchrony', function (t) {
  t.plan(1)
  pull(
    pull.values([1, 2,
      pull.values([3, 4,
        pull.values([5, 6]), 7, 8,
        pull(pull.values([9, 10,
          pull(pull.values([11, 12]), randomDelay())
        ]), randomDelay())
      ])
    ]),
    randomDelay(),
    flattenDeep(),
    pull.collect(function (err, all) {
      if (err) {
        throw err
      }
      t.assert(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].toString(), 'Order is preserved')
    })
  )
})

test('should be robust against asynchrony and aborts', function (t) {
  var endString = 'END'
  t.plan(2)
  pull(
    pull(pull.values([1, 2,
      pull.values([3, 4,
        pull.values([5, 6]), 7, 8,
        pull(pull.values([9, 10,
          pull(pull.values([11, 12]), randomDelay(endString))
        ]), randomDelay())
      ])
    ]), randomDelay()),
    randomDelay(),
    flattenDeep(),
    pull.collect(function (err, all) {
      t.assert(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].toString(), 'Order is preserved')
      t.assert(err === endString, 'Should halt the stream')
    })
  )
})
