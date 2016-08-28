'use strict';
var generate = require('./generate');
var validator = require('./validator');
var state = require('./state');
var common = require('./common');
var swaggerize = require('./swaggerize');
var swaggerSchema = require('swagger-schema-official/schema.json');
swaggerSchema.id = 'swagger';
validator.addSchema(swaggerSchema);

module.exports = {
    initialise: initialise,
    compile: compile,
    validate: callValidate,
    json: json,
    reset: state.reset,
    swaggerize: swaggerize,
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

function initialise(app, options) {
    if (!app) {
        throw new Error("options.app must be set when calling initialise");
    }
    if (state.initialised) {
        throw new Error("Already initialised, call reset first if you want to reinitialise");
    }
    state.app = app;
    state.common.defaultSecurity = options.defaultSecurity;
    state.options = options;
    swaggerize(app);
    state.initialised = true;
}

function compile() {
    ensureInitialised('compile');
    if (!state.app._router) {
        throw new Error("app._router was null, either your app is not an express app, or you have called compile before adding at least one route");
    }
    state.document = generate(state);
    state.compiled = true;
}

function callValidate() {
    validator.validate('swagger', json());
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