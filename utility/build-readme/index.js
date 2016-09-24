'use strict';
let jsdox = require("jsdox");

jsdox.generateForDir('./lib', './docs/generated/', null, allDocsGenerated);

function allDocsGenerated(err) {
    if (err) {
        throw err;
    }
}