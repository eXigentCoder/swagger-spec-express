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
    ensureValid: callEnsureValid,
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
 * @example
 * var swagger = require('swagger-spec-express');
 * var express = require('express');
 * var router = new express.Router();
 * swagger.swaggerize(router);
 * router.get('/', function (req, res) {
     *     //...
     * }).describe({
     *     //...
     * });
 * swagger.compile();
 */
function compile() {
    ensureInitialised('compile');
    if (state.app.name === 'router') {
        state.app = { _router: state.app };
    }
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
 * @example
 * var swagger = require('swagger-spec-express');
 * var express = require('express');
 * var router = new express.Router();
 * var os = require('os');
 * swagger.swaggerize(router);
 * router.get('/', function (req, res) {
     *     //...
     * }).describe({
     *     //...
     * });
 * swagger.compile();
 * var result = swagger.validate();
 * if (!result.valid) {
 *     console.warn("Compiled Swagger document does not pass validation: " + os.EOL + result.message);
 * }
 */
function callValidate() {
    return validator.validate(schemaIds.official, json());
}

/**
 * Returns the swagger specification as a json object.
 * @throws {Error} Throws an exception if called before `compile` or `initialise`. You do not need to call `validate` first.
 * @return {Object} The Swagger JSON object describing your api. See {@link http://swagger.io/specification/}.
 * @throw {Error} if not yet initialised
 * @throw {Error} if not yet compiled
 * @example
 * var swagger = require('swagger-spec-express');
 * var express = require('express');
 * var app = express();
 * var options = {
 *     title: packageJson.title,
 *     version: packageJson.version
 * };
 * swagger.initialise(app, options);
 * app.get('/swagger.json', function (err, res) {
 *     res.status(200).json(swagger.json());
 * }).describe({
 *     responses: {
 *         200: {
 *             description: "Returns the swagger.json document"
 *         }
 *     }
 * });
 * swagger.compile();
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
 * @throw {Error} if not yet compiled
 * @private
 */
function ensureCompiled(calledMethod) {
    if (!state || !state.compiled) {
        throw new Error("Compile must be called before you can call " + calledMethod);
    }
}

/**
 * Validate data using schema, will throw an error if invalid
 * Schema will be compiled and cached (using serialized JSON as key. [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used to serialize.
 * @param  {Object} data to be validated
 * @returns {void}
 * @throws {Error} if invalid, will throw an error with the message set to text from
 */
function callEnsureValid(data){
    validator.ensureValid(schemaIds.metaData, data);
}
