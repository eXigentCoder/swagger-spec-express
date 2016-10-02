'use strict';
var _ = require('lodash');
var state = require('./state-manager');
var validator = require('./validator');
var schemaIds = require('./schema-ids');
module.exports = {
    addTag: addTag,
    addHeaderParameter: addHeaderParameter,
    addBodyParameter: addBodyParameter,
    addQueryParameter: addQueryParameter,
    addFormDataParameter: addFormDataParameter,
    addPathParameter: addPathParameter,
    addResponse: addResponse,
    addResponseHeader: addResponseHeader,
    addModel: addModel,
    _validate: validator.ensureValid,
    _addToCommon: addToCommon
};
/** Adds a common tag for later use.
 * @paramSchema tag ./lib/schemas/tag.json
 * @param {object} tag Allows adding meta data to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag used there. (Generated)
 * @param {string} tag.name - Required. The name of the tag. (Generated)
 * @param {string} [tag.description] - A short description for the tag. GFM syntax can be used for rich text representation. (Generated)
 * @param {object} [tag.externalDocs] - information about external documentation (Generated)
 * @param {string} [tag.externalDocs.description] - A short description of the target documentation. GFM syntax can be used for rich text representation. (Generated)
 * @param {string} tag.externalDocs.url - Required. The URL for the target documentation. Value MUST be in the format of a URL. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addTag(tag, options) {
    addToCommon({
        schemaKey: schemaIds.tag,
        object: tag,
        targetObject: state.common.tags,
        displayName: 'Tag'
    }, options);
}
/** Adds a common header for later use.
 * @paramSchema header ./lib/schemas/header.json
 * @param {object} header todo (Generated)
 * @param {string} header.type - todo-description (Generated)
 * @param {string} [header.format] - todo-description (Generated)
 * @param {string} [header.collectionFormat] - todo-description (Generated)
 * @param {number} [header.maximum] - todo-description (Generated)
 * @param {boolean} [header.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [header.minimum] - todo-description (Generated)
 * @param {boolean} [header.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [header.maxLength] - todo-description (Generated)
 * @param {number} [header.minLength] - todo-description (Generated)
 * @param {string} [header.pattern] - todo-description (Generated)
 * @param {number} [header.maxItems] - todo-description (Generated)
 * @param {number} [header.minItems] - todo-description (Generated)
 * @param {boolean} [header.uniqueItems] - todo-description (Generated)
 * @param {Array.} [header.enum] - todo-description (Generated)
 * @param {number} [header.multipleOf] - todo-description (Generated)
 * @param {string} [header.description] - todo-description (Generated)
 * @param {string} header.name - todo-description (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addHeaderParameter(header, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.header,
        in: 'header',
        object: header,
        targetObject: state.common.parameters.header,
        displayName: 'header parameter'
    }, options);
}
/** Adds a common body parameter for later use.
 * @paramSchema body ./lib/schemas/body-parameter.json
 * @param {object} body todo (Generated)
 * @param {string} [body.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} [body.name] - The name of the parameter. (Generated)
 * @param {string} [body.in] - Determines the location of the parameter. (Generated)
 * @param {boolean} [body.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {object} [body.schema] - A deterministic version of a JSON Schema object. (Generated)
 * @param {string} [body.schema.$ref] - todo-description (Generated)
 * @param {string} [body.schema.format] - todo-description (Generated)
 * @param {string} [body.schema.title] - todo-description (Generated)
 * @param {string} [body.schema.description] - todo-description (Generated)
 * @param {number} [body.schema.multipleOf] - todo-description (Generated)
 * @param {number} [body.schema.maximum] - todo-description (Generated)
 * @param {boolean} [body.schema.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [body.schema.minimum] - todo-description (Generated)
 * @param {boolean} [body.schema.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [body.schema.maxLength] - todo-description (Generated)
 * @param {number} [body.schema.minLength] - todo-description (Generated)
 * @param {string} [body.schema.pattern] - todo-description (Generated)
 * @param {number} [body.schema.maxItems] - todo-description (Generated)
 * @param {number} [body.schema.minItems] - todo-description (Generated)
 * @param {boolean} [body.schema.uniqueItems] - todo-description (Generated)
 * @param {number} [body.schema.maxProperties] - todo-description (Generated)
 * @param {number} [body.schema.minProperties] - todo-description (Generated)
 * @param {string[]} [body.schema.required] - todo-description (Generated)
 * @param {Array.} [body.schema.enum] - todo-description (Generated)
 * @param {object|boolean} [body.schema.additionalProperties] - todo-description (Generated)
 * @param {|array} [body.schema.type] - todo-description (Generated)
 * @param {object|array} [body.schema.items] - todo-description (Generated)
 * @param {object[]} [body.schema.allOf] - todo-description (Generated)
 * @param {object} [body.schema.properties] - todo-description (Generated)
 * @param {string} [body.schema.discriminator] - todo-description (Generated)
 * @param {boolean} [body.schema.readOnly] - todo-description (Generated)
 * @param {object} [body.schema.xml] - todo-description (Generated)
 * @param {string} [body.schema.xml.name] - todo-description (Generated)
 * @param {string} [body.schema.xml.namespace] - todo-description (Generated)
 * @param {string} [body.schema.xml.prefix] - todo-description (Generated)
 * @param {boolean} [body.schema.xml.attribute] - todo-description (Generated)
 * @param {boolean} [body.schema.xml.wrapped] - todo-description (Generated)
 * @param {object} [body.schema.externalDocs] - information about external documentation (Generated)
 * @param {string} [body.schema.externalDocs.description] - todo-description (Generated)
 * @param {string} body.schema.externalDocs.url - todo-description (Generated)
 * @param {string} [body.model] - The name of the model produced or consumed. (Generated)
 * @param {string} [body.arrayOfModel] - The name of the model produced or consumed as an array. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addBodyParameter(body, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.body,
        in: 'body',
        object: body,
        targetObject: state.common.parameters.body,
        displayName: 'body parameter'
    }, options);
}
/** Adds a common query parameter for later use.
 * @paramSchema query ./lib/schemas/query-parameter-sub-schema.json
 * @param {object} query todo (Generated)
 * @param {boolean} [query.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} query.in - Determines the location of the parameter. (Generated)
 * @param {string} [query.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} query.name - The name of the parameter. (Generated)
 * @param {boolean} [query.allowEmptyValue] - allows sending a parameter by name only or with an empty value. (Generated)
 * @param {string} query.type - todo-description (Generated)
 * @param {string} [query.format] - todo-description (Generated)
 * @param {string} [query.collectionFormat] - todo-description (Generated)
 * @param {number} [query.maximum] - todo-description (Generated)
 * @param {boolean} [query.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [query.minimum] - todo-description (Generated)
 * @param {boolean} [query.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [query.maxLength] - todo-description (Generated)
 * @param {number} [query.minLength] - todo-description (Generated)
 * @param {string} [query.pattern] - todo-description (Generated)
 * @param {number} [query.maxItems] - todo-description (Generated)
 * @param {number} [query.minItems] - todo-description (Generated)
 * @param {boolean} [query.uniqueItems] - todo-description (Generated)
 * @param {Array.} [query.enum] - todo-description (Generated)
 * @param {number} [query.multipleOf] - todo-description (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addQueryParameter(query, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.query,
        in: 'query',
        object: query,
        targetObject: state.common.parameters.query,
        displayName: 'query parameter'
    }, options);
}
/** Adds a common form data parameter for later use.
 * @paramSchema formData ./lib/schemas/form-data-parameter-sub-schema.json
 * @param {object} formData todo (Generated)
 * @param {boolean} [formData.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} formData.in - Determines the location of the parameter. (Generated)
 * @param {string} [formData.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} formData.name - The name of the parameter. (Generated)
 * @param {boolean} [formData.allowEmptyValue] - allows sending a parameter by name only or with an empty value. (Generated)
 * @param {string} formData.type - todo-description (Generated)
 * @param {string} [formData.format] - todo-description (Generated)
 * @param {string} [formData.collectionFormat] - todo-description (Generated)
 * @param {number} [formData.maximum] - todo-description (Generated)
 * @param {boolean} [formData.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [formData.minimum] - todo-description (Generated)
 * @param {boolean} [formData.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [formData.maxLength] - todo-description (Generated)
 * @param {number} [formData.minLength] - todo-description (Generated)
 * @param {string} [formData.pattern] - todo-description (Generated)
 * @param {number} [formData.maxItems] - todo-description (Generated)
 * @param {number} [formData.minItems] - todo-description (Generated)
 * @param {boolean} [formData.uniqueItems] - todo-description (Generated)
 * @param {Array.} [formData.enum] - todo-description (Generated)
 * @param {number} [formData.multipleOf] - todo-description (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addFormDataParameter(formData, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.formData,
        in: 'formData',
        object: formData,
        targetObject: state.common.parameters.formData,
        displayName: 'formData parameter'
    }, options);
}
/** Adds a common path parameter for later use.
 * @paramSchema path ./lib/schemas/path-parameter-sub-schema.json
 * @param {object} path todo (Generated)
 * @param {boolean} path.required - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} path.in - Determines the location of the parameter. (Generated)
 * @param {string} [path.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} path.name - The name of the parameter. (Generated)
 * @param {string} path.type - todo-description (Generated)
 * @param {string} [path.format] - todo-description (Generated)
 * @param {string} [path.collectionFormat] - todo-description (Generated)
 * @param {number} [path.maximum] - todo-description (Generated)
 * @param {boolean} [path.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [path.minimum] - todo-description (Generated)
 * @param {boolean} [path.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [path.maxLength] - todo-description (Generated)
 * @param {number} [path.minLength] - todo-description (Generated)
 * @param {string} [path.pattern] - todo-description (Generated)
 * @param {number} [path.maxItems] - todo-description (Generated)
 * @param {number} [path.minItems] - todo-description (Generated)
 * @param {boolean} [path.uniqueItems] - todo-description (Generated)
 * @param {Array.} [path.enum] - todo-description (Generated)
 * @param {number} [path.multipleOf] - todo-description (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addPathParameter(path, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.path,
        in: 'path',
        object: path,
        targetObject: state.common.parameters.path,
        displayName: 'path parameter'
    }, options);
}
/** Adds a common response for later use.
 * @paramSchema response ./lib/schemas/response.json
 * @param {object} response todo (Generated)
 * @param {string} response.description - todo-description (Generated)
 * @param {object} [response.schema] - todo-description (Generated)
 * @param {object} [response.headers] - todo-description (Generated)
 * @param {object} [response.examples] - todo-description (Generated)
 * @param {string} response.name - todo-description (Generated)
 * @param {string} [response.model] - The name of the model produced or consumed. (Generated)
 * @param {string} [response.arrayOfModel] - The name of the model produced or consumed as an array. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addResponse(response, options) {
    addToCommon({
        schemaKey: schemaIds.response,
        object: response,
        targetObject: state.common.responses,
        displayName: 'response'
    }, options);
}
/** Adds a common response header for later use.
 * @paramSchema responseHeader ./lib/schemas/header.json
 * @param {object} responseHeader todo (Generated)
 * @param {string} responseHeader.type - todo-description (Generated)
 * @param {string} [responseHeader.format] - todo-description (Generated)
 * @param {string} [responseHeader.collectionFormat] - todo-description (Generated)
 * @param {number} [responseHeader.maximum] - todo-description (Generated)
 * @param {boolean} [responseHeader.exclusiveMaximum] - todo-description (Generated)
 * @param {number} [responseHeader.minimum] - todo-description (Generated)
 * @param {boolean} [responseHeader.exclusiveMinimum] - todo-description (Generated)
 * @param {number} [responseHeader.maxLength] - todo-description (Generated)
 * @param {number} [responseHeader.minLength] - todo-description (Generated)
 * @param {string} [responseHeader.pattern] - todo-description (Generated)
 * @param {number} [responseHeader.maxItems] - todo-description (Generated)
 * @param {number} [responseHeader.minItems] - todo-description (Generated)
 * @param {boolean} [responseHeader.uniqueItems] - todo-description (Generated)
 * @param {Array.} [responseHeader.enum] - todo-description (Generated)
 * @param {number} [responseHeader.multipleOf] - todo-description (Generated)
 * @param {string} [responseHeader.description] - todo-description (Generated)
 * @param {string} responseHeader.name - todo-description (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addResponseHeader(responseHeader, options) {
    addToCommon({
        schemaKey: schemaIds.header,
        object: responseHeader,
        targetObject: state.common.responseHeaders,
        displayName: 'header response',
        deleteNameFromCommon: true
    }, options);
}
/** Adds a common model for later use.
 * @param {object} model The model object to add.
 * @param {AddCommonItemOptions} inputOptions - Options to apply when adding the provided item.
 * @returns {void}
 */
function addModel(model, inputOptions) {
    var options = {
        schemaKey: schemaIds.schema,
        object: model,
        targetObject: state.common.models,
        displayName: 'Model',
        deleteNameFromCommon: true
    };
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    delete options.object.$schema;
    delete options.object.id;
    var definitions = options.object.definitions;
    delete options.object.definitions;
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
    if (!definitions) {
        return;
    }
    Object.keys(definitions).forEach(function (key) {
        var definition = _.cloneDeep(definitions[key]);
        definition.name = key;
        addModel(definition, inputOptions);
    });
}
function addToCommon(options, inputOptions) {
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    if (!_.isNil(options.in)) {
        options.object.in = options.in;
    }
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
}
/**
 * Applies the defaults or input options to the options class
 * @param {object} options - The provided options.
 * @param {AddCommonItemOptions} inputOptions - The provided input options.
 * @returns {void}
 * @private
 */
function applyDefaults(options, inputOptions) {
    if (!options) {
        throw new Error('Options is required');
    }
    var defaults = {
        validation: 'throw',
        //warn, ignore,
        deleteNameFromCommon: false
    };
    inputOptions = inputOptions || {};
    var keys = Object.keys(defaults);
    inputOptions = _.pick(inputOptions, keys);
    _.defaults(options, inputOptions, defaults);
}
function ensureObjectExists(options) {
    if (!options.displayName) {
        throw new Error('displayName is required.');
    }
    if (!options.object) {
        throw new Error(options.displayName + ' is required.');
    }
    if (!_.isObject(options.object)) {
        throw new Error(options.displayName + ' must be an object');
    }
}
function cloneObject(options) {
    options.object = _.cloneDeep(options.object);
}
function applyValidation(options) {
    if (options.validation === 'ignore') {
        return;
    }
    if (options.validation === 'throw') {
        return validator.ensureValid(options.schemaKey, options.object);
    }
    var result = validator.validate(options.schemaKey, options.object);
    if (result.valid) {
        return;
    }
    console.warn(result.message, result.error);
}
function ensureHasName(options) {
    if (!options.object.name) {
        throw new Error('Name is required');
    }
    if (!_.isString(options.object.name)) {
        throw new Error('Name must be a string');
    }
}
function ensureNotAlreadyAdded(options) {
    var existingObject = options.targetObject[options.object.name];
    if (existingObject) {
        existingObject.name = options.object.name;
        if (!_.isEqual(existingObject, options.object)) {
            throw new Error('There already is a ' + options.displayName.toLowerCase() + ' with the name ' + options.object.name + ' and the objects themselves were not equal. Existing ' + JSON.stringify(existingObject) + ' Object to add :' + JSON.stringify(options.object));
        }
    }
}
function setObjectOnTarget(options) {
    options.targetObject[options.object.name] = options.object;
}
function applyNameDeletion(options) {
    if (options.deleteNameFromCommon) {
        delete options.targetObject[options.object.name].name;
    }
}    /**
      * @name AddCommonItemOptions
      * @prop {string} validation - Controls how validation works, can either be warn (Sends message to console.warn), throw (Throws an Error) or ignore.
      * @prop deleteNameFromCommon - Controls if, after adding the item to common, if it should remove the name in order to pass the Swagger schema validation.
      */