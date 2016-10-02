'use strict';
var injectSchema = require('./inject-schema');

injectSchema('./lib/swaggerise.js', injectionComplete);

function injectionComplete(err) {
    if (err) {
        throw err;
    }
}