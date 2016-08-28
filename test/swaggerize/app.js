'use strict';
require('./../init');
var swagger = require('../../lib/index');
var express = require('express');
describe('Swaggerize app tests', function () {
    var app;
    beforeEach(function () {
        swagger.reset();
        app = express();
        var options = {};
        swagger.swaggerize(app, options);
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