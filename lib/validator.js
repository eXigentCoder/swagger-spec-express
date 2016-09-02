'use strict';
var _ = require('lodash');
var jsonSchemaFilter = require('json-schema-filter');
var Ajv = require('ajv');
var ajv = new Ajv();


module.exports = {
    addSchema: addSchema,
    removeSchema: removeSchema,
    validate: validate,
    getErrorMessage: getErrorMessage,
    ensureValid: ensureValid,
    getSchema: getSchema,
    filterDataBySchema: filterDataBySchema
};

/**
 * Adds schema(s) to the instance.
 * @param {Object|Array} schema schema or array of schemas. If array is passed, `key` and other parameters will be ignored.
 * @param {String} key Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
 * @returns {void}
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
    if (!key && !schema.id) {
        throw new Error("No key was provided and no id was set");
    }
    ajv.addSchema(schema, key);
}

/**
 * Remove cached schema(s).
 * If no parameter is passed all schemas but meta-schemas are removed.
 * If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
 * Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
 * @param  {String|Object|RegExp} schemaKeyRef key, ref, pattern to match key/ref or schema object
 * @returns {void}
 */
function removeSchema(schemaKeyRef) {
    ajv.removeSchema(schemaKeyRef);
}

/**
 * Validate data using schema, will throw an error if invalid
 * Schema will be compiled and cached (using serialized JSON as key. [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used to serialize.
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Any} data to be validated
 * @returns {void}
 * @throws {Error} if invalid, will throw an error with the message set to text from
 * @see {@link getErrorMessage}
 */
function ensureValid(schemaKeyRef, data) {
    var result = validate(schemaKeyRef, data);
    if (!result.valid) {
        var error = new Error(result.message);
        error.errors = result.errors;
        throw error;
    }
}

/**
 * Gets a human readable error message from the ajv errors object, using the ajv.errorsText and some custom logic
 * @param {Array} errors the ajv.errors object
 * @returns {String} The human readable error message
 * @see Ajv.ajv.errorsText
 */
function getErrorMessage(errors) {
    var message = ajv.errorsText(errors);
    if (message.indexOf('should NOT have additional properties') < 0) {
        return message;
    }
    errors.forEach(function (error) {
        message += '. Property : ' + error.params.additionalProperty;
    });
    return message;
}


/**
 * Validate data using schema
 * Schema will be compiled and cached (using serialized JSON as key. [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used to serialize.
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Object} data to be validated
 * @return {{valid: boolean, errors: object[], message: string}} The result of the validation
 */
function validate(schemaKeyRef, data) {
    if (!schemaKeyRef) {
        throw new Error("schemaKeyRef is required");
    }
    if (_.isArray(schemaKeyRef)) {
        throw new Error("schemaKeyRef cannot be an array");
    }
    if (_.isObject(schemaKeyRef) && schemaKeyRef.id) {
        var existingSchema = ajv.getSchema(schemaKeyRef.id);
        if (existingSchema) {
            schemaKeyRef = schemaKeyRef.id;
        }
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
 */
function getSchema(keyRef) {
    return ajv.getSchema(keyRef);
}

/**
 * Filters the provided data object's properties based on the supplied schema
 * @returns {Object} The mapped object the result of the mapping.
 * @param {String|Object} schemaKeyRef The key, ref or schema object.
 * @param {Object} data The data object to be mapped.
 */
function filterDataBySchema(schemaKeyRef, data) {
    if (!schemaKeyRef) {
        throw new Error("SchemaKeyRef is required.");
    }
    if (!data) {
        throw new Error("Data is required.");
    }
    if (!_.isObject(data)) {
        throw new Error("Data must be an object.");
    }
    if (_.isString(schemaKeyRef)) {
        var schemaFn = getSchema(schemaKeyRef);
        if (schemaFn && schemaFn.schema) {
            return jsonSchemaFilter(schemaFn.schema, data);
        }
        throw new Error("Can't map data by schema key when the schema has not yet been added. Key : " + schemaKeyRef
            + ". Either call addSchema first or pass in the schema object.");
    }
    if (!_.isObject(schemaKeyRef)) {
        throw new Error("schemaKeyRef must be an object or string.");
    }
    return jsonSchemaFilter(schemaKeyRef, data);
}