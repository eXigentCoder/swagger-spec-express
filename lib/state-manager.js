'use strict';
var State = require('./state');

var state = {
    reset: reset
};

function reset() {
    clearProperties();
    setProperties(State());
}

reset();
module.exports = state;

function clearProperties() {
    Object.keys(state).forEach(function (key) {
        if (key === 'reset') {
            return;
        }
        delete state[key];
    });
}

function setProperties(newState) {
    Object.keys(newState).forEach(function (key) {
        state[key] = newState[key];
    });
}