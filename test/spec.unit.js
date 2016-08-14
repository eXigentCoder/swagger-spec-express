'use strict';
require('./init');
var swagger = require('../lib');

describe('Spec', function () {
    beforeEach(function () {
        swagger.reset();
    });
    describe('initialise', function () {
        var initOptions = {};
        it('Should not return and error when called with the example arguments', function (done) {
            swagger.initialise(initOptions, done);
        });
    });
    describe('compile', function () {
        it('Should return and error when called before initialise', function (done) {
            swagger.compile(function (err) {
                expect(err, "Should have thrown an error because initialise was not called").to.be.ok();
                done();
            });
        });
    });
    describe('json', function () {
        function callJson() {
            swagger.json();
        }

        it('Should return and error when called before initialise', function () {
            expect(callJson).to.throw(Error);
        });
        it('Should return and error when called before compile', function () {
            expect(callJson).to.throw(Error);
        });
    });
});