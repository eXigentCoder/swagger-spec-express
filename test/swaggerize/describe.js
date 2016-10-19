'use strict';
require('./../init');
var swagger = require('../../lib/index');
var express = require('express');

describe('Describe tests', function () {
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

    it('Should throw an error if there are not responses', function () {
        app.get('/', exampleRoute);
        var noResponse = {};
        expect(callDescribe(noResponse)).to.throw();
    });
    it('Should not throw an error if there is a standard response', function () {
        app.get('/', exampleRoute);
        var standardResponse = {
            responses: {
                200: {
                    description: "Success!"
                }
            }
        };
        expect(callDescribe(standardResponse)).to.not.throw();
    });
    it('Should not throw an error if there is a common response', function () {
        app.get('/', exampleRoute);
        var standardResponse = {
            common: {
                responses: ["200", "500"]
            }
        };
        expect(callDescribe(standardResponse)).to.not.throw();
    });
});

function exampleRoute(req, res) {
    res.status(200).json({test: true});
}