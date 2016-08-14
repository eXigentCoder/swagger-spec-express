'use strict';
require('./init');
var swagger = require('../lib');

describe('Spec', function () {
    beforeEach(function () {
        swagger.reset();
    });
    var initOptions = {};
    describe('initialise', function () {
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
        it('Should not return and error when called after initialise', function (done) {
            swagger.initialise(initOptions, function () {
                swagger.compile(function (err) {
                    expect(err, "Should have thrown an error because initialise was not called").to.not.be.ok();
                    done();
                });
            });
        });
    });
    describe('json', function () {
        function callJson() {
            swagger.json();
        }

        it('Should throw and error when called before initialise', function () {
            expect(callJson).to.throw(Error);
        });
        it('Should throw and error when called before compile but after initialise', function (done) {
            swagger.initialise(initOptions, function () {
                expect(callJson).to.throw(Error);
                done();
            });
        });
        it('Should not throw and error when called after initialise and compile', function (done) {
            swagger.initialise(initOptions, function () {
                swagger.compile(function () {
                    expect(callJson).to.not.throw(Error);
                    done();
                });
            });
        });
    });
    describe('reset', function () {
        function callReset() {
            swagger.reset();
        }

        it('Should not throw an error when called', function () {
            expect(callReset).to.not.throw();
        });
    });
});