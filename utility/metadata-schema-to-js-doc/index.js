'use strict';
var injectSchema = require('./inject-schema');
var schema = require('../../lib/schemas/meta-data.json');
var filePath = './lib/swaggerise.js';
var target = 'function describe(metaData) {';

var options = {
    schema: schema,
    filePath: filePath,
    target: target
};
injectSchema(options, injectionComplete);

function injectionComplete(err) {
    if (err) {
        throw err;
    }
}