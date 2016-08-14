'use strict';
var swaggerSpec;

module.exports = {
    initialise: initialise,
    compile: compile,
    json: json,
    reset: reset
};

function initialise(options, callback) {
    reset();
    swaggerSpec.initialised = true;
    return callback();
}
function reset() {
    swaggerSpec = {
        initialised: false,
        compiled: false
    };
}

function compile(callback) {
    if (!swaggerSpec || !swaggerSpec.initialised) {
        return callback(new Error("Initialise must be called before you can compile the swagger spec"));
    }
    swaggerSpec.compiled = true;
    return callback();
}

function json() {
    if (!swaggerSpec || !swaggerSpec.initialised) {
        throw new Error("Initialise must be called before you can compile the swagger spec");
    }
    if (!swaggerSpec.compiled) {
        throw new Error("Compile must be called before you can compile the swagger spec");
    }
    return JSON.stringify('', null, 4);
}