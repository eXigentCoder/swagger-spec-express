'use strict';
var state = require('./state-manager');
var swaggerize = require('./swaggerise');
var _ = require('lodash');
var validator = require('./validator');

module.exports = function initialise(app, options) {
    if (!app) {
        throw new Error("options.app must be set when calling initialise");
    }
    if (state.initialised) {
        throw new Error("Already initialised, call reset first if you want to reinitialise");
    }
    state.app = app;
    state.options = options;
    setOption(options, 'defaultSecurity');
    mergeOptions(options, 'ajvValidationOptions');
    validator.initialise(state.ajvValidationOptions);
    mergeOptions(options, 'document');
    swaggerize(app);
    state.initialised = true;
};

function mergeOptions(options, key) {
    var merged = {};
    _.defaults(merged, options[key], state[key]);
    state[key] = merged;
    delete options[key];
}

function setOption(options, key) {
    state.common[key] = options[key];
    delete options[key];
}
