'use strict';
require('./../init');
var swagger = require('../../lib/index');
var express = require('express');
describe('Spec', function () {
    var router;
    beforeEach(function () {
        swagger.reset();
        router = new express.Router();
        swagger.swaggerize(router);
    });
    function callDescribe(metadata) {
        return function () {
            router.describe(metadata);
        };
    }

    it('Should not throw an error if the object is an express app', function () {
        router.get('/', exampleRoute);
        expect(callDescribe(exampleMetadata())).to.not.throw();
    });

    it('Should throw an error if the router has no routes', function () {
        expect(callDescribe({})).to.throw();
    });

    it('Should throw an error if no metadata', function () {
        expect(callDescribe()).to.throw();
    });

    it('Should support the `merge` verb', function () {
        router.merge('/', exampleRoute);
        expect(callDescribe(exampleMetadata())).to.not.throw();
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