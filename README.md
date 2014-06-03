simple-memo [![Build Status](https://travis-ci.org/evocateur/simple-memo.svg?branch=master)](https://travis-ci.org/evocateur/simple-memo)
===========

Simple memoization of function executions.

```js
var memoize = require("simple-memo");
var wrapped = memoize(function (a, b) {
    return a + b;
});
wrapped("foo", "bar"); // returns computed "foobar"
wrapped("foo", "bar"); // returns cached "foobar"
```

You can customize the internal cache keys by passing a hasher callback
to the exported function, but I'm not sure why you'd need to.
