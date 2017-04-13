# pull-flatten-deep
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Pull-stream which recursively flattens streams of streams.

## Usage
```js
const pull = require('pull-stream')
const flattenDeep = require('pull-flatten-deep')

 pull(
  pull.values([1, 2, pull.values([3, 4, pull.values([5, 6]), 7, 8, pull.values([9, 10, pull.values([11, 12])])])]),
  flattenDeep(),
  pull.collect(function (err, all) {
    console.log(all.toString() === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].toString())
    // true
  })
)
```

## API
### flattenDeep

Usage: `pull(source, flattenDeep(), sink)`

Provides a pull stream through which flattens nested streams, and like pull.flatten, runs them sequentially.

## Installation
```sh
$ npm install pull-flatten-deep
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/pull-flatten-deep.svg?style=flat-square
[3]: https://npmjs.org/package/pull-flatten-deep
[4]: https://img.shields.io/travis/JDvorak/pull-flatten-deep/master.svg?style=flat-square
[5]: https://travis-ci.org/JDvorak/pull-flatten-deep
[6]: https://img.shields.io/codecov/c/github/JDvorak/pull-flatten-deep/master.svg?style=flat-square
[7]: https://codecov.io/github/JDvorak/pull-flatten-deep
[8]: http://img.shields.io/npm/dm/pull-flatten-deep.svg?style=flat-square
[9]: https://npmjs.org/package/pull-flatten-deep
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
