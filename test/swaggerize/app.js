'use strict';
require('./../init');
var swagger = require('../../lib/index');
var express = require('express');
describe('Swaggerize app tests', function () {
    beforeEach(function () {
        swagger.reset();
    });
    it('Should not throw an error if the object is an express app', function () {
        var app = express();
        swagger.swaggerize(app);
    });
});