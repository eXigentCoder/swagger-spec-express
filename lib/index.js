'use strict';
var generate = require('./generate');
var validator = require('./validator');
var addSchemas = require('./add-schemas');
var state = require('./state-manager');
var common = require('./common');
var swaggerise = require('./swaggerise');
var initialise = require('./initialise');
var schemaIds = require('./schema-ids');
addSchemas(validator);
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

/**
 * Will gather together all your described app routes and compile them into a single document to be served up by your api when you call `json`.
 * Can only be called once `initialise` has been called. Should only call this once you have completely finished describing your routes.
 * @returns {void}
 * @throws {Error} Will throw an error if `initialise` wasn't called or if you don't yet have any routes defined or if there are certain errors in your metadata
 */
function compile() {
    ensureInitialised('compile');
    if (!state.app._router) {
        throw new Error("app._router was null, either your app is not an express app, or you have called compile before adding at least one route");
    }
    state.document = generate(state);
    state.compiled = true;
}

/**
 * Will validate the internal json document created by calling `compile`.
 * This is done using the [ajv](https://www.npmjs.com/package/ajv) validator against the [official JSON schema](https://www.npmjs.com/package/swagger-schema-official). * @throws {Error} Throws an exception if called before `compile` or `initialise`.
 * @name validate
 * @returns {{valid: boolean, errors: Object[], message: string}} The result of the validation
 */
function callValidate() {
    return validator.validate(schemaIds.official, json());
}

/**
 * Returns the swagger specification as a json object.
 * @throws {Error} Throws an exception if called before `compile` or `initialise`. You do not need to call `validate` first.
 * @return {Object} The Swagger JSON object describing your api
 */
function json() {
    ensureInitialised('json');
    ensureCompiled('json');
    return state.document;
}

/**
 * @param {string} calledMethod Name of the method calling ensureInitialised so that the error message can be as descriptive as possible
 * @returns {void}
 * @throw {Error} if not yet initialised
 * @private
 */
function ensureInitialised(calledMethod) {
    if (!state || !state.initialised) {
        throw new Error("Initialise must be called before you can call " + calledMethod);
    }
}

/**
 * @param {string} calledMethod Name of the method calling ensureCompiled so that the error message can be as descriptive as possible
 * @returns {void}
 * @throw {Error} if not yet initialised
 * @private
 */
function ensureCompiled(calledMethod) {
    if (!state || !state.compiled) {
        throw new Error("Compile must be called before you can call " + calledMethod);
    }
}