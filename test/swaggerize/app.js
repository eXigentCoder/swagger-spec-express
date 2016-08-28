'use strict';
require('./../init');
var swagger = require('../../lib/index');
var express = require('express');
var async = require('async');

describe('Swaggerize app tests', function () {
    var app;
    beforeEach(function () {
        swagger.reset();
        app = express();
        swagger.swaggerize(app, {});
    });
    function callDescribe(metadata) {
        return function () {
            app.describe(metadata);
        };
    }

    it('Should not throw an error if the object is an express app', function () {
        app.get('/', exampleRoute);
        expect(callDescribe(exampleMetadata())).to.not.throw();
    });

    it('Should throw an error if the router has no routes', function () {
        expect(callDescribe({})).to.throw();
    });

    it('Should throw an error if no metadata', function () {
        expect(callDescribe()).to.throw();
    });
    it('Should throw an error if the object has no stack', function () {
        var fakeApp = {
            _router: {}
        };
        swagger.swaggerize(fakeApp, {});
        expect(async.apply(fakeApp.describe, exampleMetadata())).to.throw();
    });
    it('Should throw an error if the object has a stack but the last route is not a route', function () {
        var fakeApp = {
            _router: {
                stack: [{}]
            }
        };
        swagger.swaggerize(fakeApp, {});
        expect(async.apply(fakeApp.describe, exampleMetadata())).to.throw();
    });
    it('Should throw an error if the object has a stack but the last route does not have the correct verb', function () {
        var fakeApp = {
            _router: {
                stack: [{
                    route: {
                        methods: []
                    }
                }]
            }
        };
        swagger.swaggerize(fakeApp, {});
        expect(async.apply(fakeApp.describe, exampleMetadata())).to.throw();
    });
});

function exampleRoute(req, res) {
    res.status(200).json({test: true});
}

function exampleMetadata() {
    return {
        responses: {
            200: {
                description: "Success!"
            }
        }
    };
}