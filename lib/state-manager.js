'use strict';
var _ = require('lodash');
var State = require('./state');

var state = {
    reset: reset
};

function reset() {
    clearProperties();
    setProperties(new State());
}

reset();
module.exports = state;

function clearProperties() {
    var keys = Object.keys(state);
    _.unset(state, keys);
}

function setProperties(newState) {
    Object.keys(newState).forEach(function (key) {
        state[key] = newState[key];
    });
}