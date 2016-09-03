'use strict';
var generate = require('./generate');
var validator = require('./validator');
var state = require('./state-manager');
var common = require('./common');
var swaggerise = require('./swaggerise');
var initialise = require('./initialise');
var schemaIds = require('./schema-ids');

module.exports = {
    initialise: initialise,
    initialize: initialise,
    compile: compile,
    validate: callValidate,
    json: json,
    reset: state.reset,
    swaggerise: swaggerise,
    swaggerize: swaggerise,
    common: {
        addModel: common.addModel,
        addTag: common.addTag,
        parameters: {
            addHeader: common.addHeaderParameter,
            addBody: common.addBodyParameter,
            addQuery: common.addQueryParameter,
            addFormData: common.addFormDataParameter,
            addPath: common.addPathParameter
        },
        addResponse: common.addResponse,
        addResponseHeader: common.addResponseHeader
    }
};


function compile() {
    ensureInitialised('compile');
    if (!state.app._router) {
        throw new Error("app._router was null, either your app is not an express app, or you have called compile before adding at least one route");
    }
    state.document = generate(state);
    state.compiled = true;
}

function callValidate() {
    return validator.validate(schemaIds.official, json());
}

function json() {
    ensureInitialised('json');
    ensureCompiled('json');
    return state.document;
}

function ensureInitialised(calledMethod) {
    if (!state || !state.initialised) {
        throw new Error("Initialise must be called before you can call " + calledMethod);
    }
}

function ensureCompiled(calledMethod) {
    if (!state || !state.compiled) {
        throw new Error("Compile must be called before you can call " + calledMethod);
    }
}