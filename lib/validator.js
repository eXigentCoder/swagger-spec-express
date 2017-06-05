'use strict';
var _ = require('lodash');
var os = require('os');
var Ajv = require('ajv');
var util = require('util');

var ajv = new Ajv({
    // removeAdditional: 'failing', causing exceptions
    // useDefaults: true, causing exceptions
    coerceTypes: true,
    allErrors: true,
    verbose: true,
    format: 'full'
});
var validator = {
    addSchema: addSchema,
    removeSchema: removeSchema,
    validate: validate,
    getErrorMessage: getErrorMessage,
    ensureValid: ensureValid,
    getSchema: getSchema,
    compile: compile
};

module.exports = validator;


/**
 * Adds schema(s) to the instance.
 * @param {Object|Array} schema schema or array of schemas. If array is passed, `key` and other parameters will be ignored.
 * @param {String} [key] Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
 * @returns {void}
 * @private
 */
function addSchema(schema, key) {
    if (!schema) {
        throw new Error("Schema is required");
    }
    if (_.isArray(schema)) {
        if (key) {
            throw new Error("Cannot call add schema with an array of schemas and a key. Id from each schema will be used as the key");
        }
        return schema.forEach(function (schemaItem) {
            addSchema(schemaItem, null);
        });
    }
    if (!_.isObject(schema)) {
        throw new Error("Schema must be an object");
    }
    if (!key && !schema.$id) {
        throw new Error(util.format("No key was provided and no $id was set, for performance reasons don't do this. %j", schema));
    }
    if(!key){
        key = schema.$id;
    }
    try{
        ajv.addSchema(schema, key);
    }
    catch (err){
        throw new Error(util.format('Error adding schema "%s".\n%s\n', key, err.message));
    }
}

/**
 * Remove cached schema(s).
 * If no parameter is passed all schemas but meta-schemas are removed.
 * If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
 * Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
 * @param  {String|Object|RegExp} schemaKeyRef key, ref, pattern to match key/ref or schema object
 * @returns {void}
 * @private
 */
function removeSchema(schemaKeyRef) {
    ajv.removeSchema(schemaKeyRef);
}

/**
 * Validate data using schema, will throw an error if invalid
 * Schema will be compiled and cached (using serialized JSON as key. [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used to serialize.
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Object} data to be validated
 * @returns {void}
 * @throws {Error} if invalid, will throw an error with the message set to text from
 * @see {@link getErrorMessage}
 * @private
 */
function ensureValid(schemaKeyRef, data) {
    var result;
    result = validate(schemaKeyRef, data);
    if (!result.valid) {
        var error = new Error(result.message);
        error.errors = result.errors;
        throw error;
    }
}

/**
 * Gets a human readable error message from the ajv errors object, using the ajv.errorsText and some custom logic
 * @param {Object[]} errors the ajv.errors object
 * @returns {String} The human readable error message
 * @see Ajv.ajv.errorsText
 * @private
 */
function getErrorMessage(errors) {
    var fullMessage = '';
    errors.forEach(function (err) {
        var message = ajv.errorsText([err]);
        if (message.indexOf('should NOT have additional properties') < 0) {
            fullMessage += message + os.EOL;
        }
        else {
            fullMessage += message + '. Offending property : ' + err.params.additionalProperty + os.EOL;
        }
    });
    return fullMessage;
}

/**
 * Validate data using schema
 * Schema will be compiled and cached (using serialized JSON as key. [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used to serialize.
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Object} data to be validated
 * @return {{valid: boolean, errors: object[], message: string}} The result of the validation
 * @private
 */
function validate(schemaKeyRef, data) {
    if (!schemaKeyRef) {
        throw new Error("schemaKeyRef is required");
    }
    if (!data) {
        throw new Error("data is required");
    }
    if (!_.isString(schemaKeyRef)) {
        throw new Error("schemaKeyRef must be a string");
    }
    if (!_.isObject(data)) {
        throw new Error("data must be an object");
    }
    var result = {};
    result.valid = ajv.validate(schemaKeyRef, data);
    if (!result.valid) {
        result.errors = ajv.errors;
        result.message = getErrorMessage(ajv.errors);
    }
    return result;
}

/**
 * Get compiled schema from the instance by `key` or `ref`.
 * @param  {String} keyRef `key` that was passed to `addSchema` or full schema reference (`schema.id` or resolved id).
 * @return {Function} schema validating function (with property `schema`).
 * @private
 */
function getSchema(keyRef) {
    return ajv.getSchema(keyRef);
}

/**
 * Create validating function for passed schema.
 * @param  {Object} schema schema object
 * @param  {Boolean} _meta true if schema is a meta-schema. Used internally to compile meta schemas of custom keywords.
 * @return {Function} validating function
 * @private
 */
function compile(schema) {
    return ajv.compile(schema);
}