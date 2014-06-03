/*global describe, it, beforeEach, afterEach */

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var should = chai.should();
chai.use(sinonChai);

var memoize = require("./");

describe("wrapped function", function () {
    /*jshint expr:true */
    var expensiveFn = function (a, b) { return a + b; };
    var dashedHasher = function () {
        return Array.prototype.join.call(arguments, "-");
    };

    it("should have hasher, cache, and fn properties", function () {
        var wrapped = memoize(expensiveFn);
        wrapped.should.have.property("hasher", memoize.hasher);
        wrapped.should.have.property("cache").that.deep.equals({});
        wrapped.should.have.property("fn", expensiveFn);
    });

    describe("hasher", function () {
        beforeEach(function () {
            sinon.spy(memoize, "hasher");
        });
        afterEach(function () {
            memoize.hasher.restore();
            if (this.wrapped) {
                this.wrapped = null;
            }
        });

        describe("defaulted", function () {
            beforeEach(function () {
                this.wrapped = memoize(expensiveFn);
            });

            it("should use default cache keys", function () {
                var result = this.wrapped("foo", "bar");
                memoize.hasher.should.have.been.calledOnce;
                this.wrapped.cache.should.have.property("foo__bar", "foobar");
            });

            it("should return cached value on subsequent execution", function () {
                sinon.spy(this.wrapped, "fn");
                this.wrapped("foo", "bar");
                var cachedResult = this.wrapped("foo", "bar");
                this.wrapped.fn.should.have.been.calledOnce;
                memoize.hasher.should.have.been.calledTwice;
                this.wrapped.cache.should.deep.equal({
                    "foo__bar": "foobar"
                });
            });
        });

        describe("customized", function () {
            beforeEach(function () {
                this.wrapped = memoize(expensiveFn, dashedHasher);
            });

            it("should store custom hasher", function () {
                this.wrapped.hasher.should.equal(dashedHasher);
            });

            it("should use customized cache keys", function () {
                var result = this.wrapped("foo", "bar");
                memoize.hasher.should.not.have.been.called;
                this.wrapped.cache.should.have.property("foo-bar", "foobar");
            });
        });
    });
});
