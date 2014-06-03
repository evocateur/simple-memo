/**
Return a memoized function, which will short-circuit duplicate calls
with a cached return value.

@param {Function} fn
@param {Function} [hasher=exports.hasher] An optional function
            that returns a string to be used as a cache key.
@return {Function}
**/
function memoize(fn, hasher) {
    memo.hasher = hasher || memoize.hasher;
    memo.cache = {};
    memo.fn = fn;

    function memo() {
        var key = memo.hasher.apply(null, arguments);

        if (!(key in memo.cache)) {
            memo.cache[key] = memo.fn.apply(null, arguments);
        }

        return memo.cache[key];
    }

    return memo;
}

/**
Default hasher, which joins the arguments with doubled underscores.

@method exports.hasher
@return {String}
@static
**/
memoize.hasher = function () {
    return Array.prototype.join.call(arguments, '__');
};

module.exports = memoize;
