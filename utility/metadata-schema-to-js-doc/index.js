'use strict';
var injectSchema = require('./inject-schema');

injectSchema([
    './lib/swaggerise.js',
    './lib/common.js'
], injectionComplete);

function injectionComplete(err) {
    if (err) {
        throw err;
    }
    process.exit(0);
}