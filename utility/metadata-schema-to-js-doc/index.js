'use strict';
var injectSchema = require('./inject-schema');
var schema = require('../../lib/schemas/meta-data.json');

var options = {
    schema: schema,
    filePath: './lib/swaggerise.js'
};
injectSchema(options, injectionComplete);

function injectionComplete(err) {
    if (err) {
        throw err;
    }
}