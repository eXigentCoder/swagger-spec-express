'use strict';
require('./init');
var swagger = require('../lib');
var express = require('express');
describe('Swaggerize app tests', function () {
    beforeEach(function () {
        swagger.reset();
    });
    it('Should work if the object is an express app', function () {
        var app = express();
        var router = new express.Router();
        swagger.swaggerize(app);
        swagger.swaggerize(router);
    });
});