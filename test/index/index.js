'use strict';
require('./../init');
var swagger = require('../../lib/index');

describe('Spec', function () {
    beforeEach(function () {
        swagger.reset();
    });
    var app = {
        _router: {
            stack: []
        }
    };
    var initOptions = {};
    describe('initialise', function () {
        it('Should not return an error when called with the example arguments', function () {
            swagger.initialise(app, initOptions);
        });
    });
    describe('compile', function () {
        function callComplie() {
            swagger.compile();
        }

        it('Should return an error when called before initialise', function () {
            expect(callComplie, "Should have thrown an error because initialise was not called").to.throw();
        });
        it('Should not return an error when called after initialise', function () {
            swagger.initialise(app, initOptions);
            expect(callComplie, "Should have thrown an error because initialise was not called").to.not.throw();
        });
    });
    describe('json', function () {
        function callJson() {
            swagger.json();
        }

        it('Should throw an error when called before initialise', function () {
            expect(callJson).to.throw(Error);
        });
        it('Should throw an error when called before compile but after initialise', function () {
            swagger.initialise(app, initOptions);
            expect(callJson).to.throw(Error);
        });
        it('Should not throw an error when called after initialise and compile', function () {
            swagger.initialise(app, initOptions);
            swagger.compile();
            expect(callJson).to.not.throw(Error);
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
    describe('validate', function () {
        function callValidate() {
            swagger.validate();
        }

        it('Should throw an error when called before initialise', function () {
            expect(callValidate).to.throw(Error);
        });
        it('Should throw an error when called before compile but after initialise', function () {
            swagger.initialise(app, initOptions);
            expect(callValidate).to.throw(Error);
        });
        it('Should not throw an error when called after initialise and compile', function () {
            swagger.initialise(app, initOptions);
            swagger.compile();
            expect(callValidate).to.not.throw(Error);
        });
    });
});