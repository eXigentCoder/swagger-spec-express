'use strict';
var injectSchema = require('./inject-schema');
var schema = require('../../lib/schemas/meta-data.json');
var filePath = './lib/swaggerise.js';

var options = {
    schema: schema,
    filePath: filePath
};
injectSchema(options, injectionComplete);

function injectionComplete(err) {
    if (err) {
        throw err;
    }
}