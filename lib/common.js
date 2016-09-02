'use strict';
var _ = require('lodash');
var state = require('./state');
var validator = require('./validator');

/* eslint-disable global-require */
validator.addSchema([
    require('./schemas/body-parameter.json'),
    require('./schemas/form-data-parameter-sub-schema.json'),
    require('./schemas/header-parameter-sub-schema.json'),
    require('./schemas/path-parameter-sub-schema.json'),
    require('./schemas/query-parameter-sub-schema.json'),
    require('./schemas/schema.json'),
    require('./schemas/response.json'),
    require('./schemas/tag.json'),
    require('./schemas/header.json')
]);
/* eslint-enable global-require */

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

var defaults = {
    validation: 'throw', //warn, ignore,
    deleteNameFromCommon: false,
    filterProperties: true
};

function addTag(data, options) {
    addToCommon({
        schemaKey: 'tag',
        object: data,
        targetObject: state.common.tags,
        displayName: 'Tag'
    }, options);
}

function addHeaderParameter(data, options) {
    addToCommon({
        schemaKey: 'header-parameter-sub-schema',
        in: 'header',
        object: data,
        targetObject: state.common.parameters.header,
        displayName: 'header parameter'
    }, options);
}

function addBodyParameter(data, options) {
    addToCommon({
        schemaKey: 'body-parameter',
        in: 'body',
        object: data,
        targetObject: state.common.parameters.body,
        displayName: 'body parameter'
    }, options);
}

function addQueryParameter(data, options) {
    addToCommon({
        schemaKey: 'query-parameter-sub-schema',
        in: 'query',
        object: data,
        targetObject: state.common.parameters.query,
        displayName: 'query parameter'
    }, options);
}

function addFormDataParameter(data, options) {
    addToCommon({
        schemaKey: 'form-data-parameter-sub-schema',
        in: 'formData',
        object: data,
        targetObject: state.common.parameters.formData,
        displayName: 'formData parameter'
    }, options);
}

function addPathParameter(data, options) {
    addToCommon({
        schemaKey: 'path-parameter-sub-schema',
        in: 'path',
        object: data,
        targetObject: state.common.parameters.path,
        displayName: 'path parameter'
    }, options);
}

function addResponse(data, options) {
    addToCommon({
        schemaKey: 'response',
        object: data,
        targetObject: state.common.parameters.responses,
        displayName: 'response'
    }, options);
}

function addResponseHeader(data, options) {
    addToCommon({
        schemaKey: 'header',
        object: data,
        targetObject: state.common.responseHeaders,
        displayName: 'header response',
        deleteNameFromCommon: true
    }, options);
}


function addModel(data, inputOptions) {
    var options = {
        schemaKey: 'schema',
        object: data,
        targetObject: state.common.models,
        displayName: 'Model',
        deleteNameFromCommon: true
    };
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    var definitions = options.object.definitions;
    delete options.object.definitions;
    applyFilter(options);
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
    delete options.object.$schema;
    if (!definitions) {
        return;
    }
    Object.keys(definitions).forEach(function (key) {
        var definition = definitions[key];
        addModel(key, definition);
    });
}


function addToCommon(options, inputOptions) {
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    if (!_.isNil(options.in)) {
        options.object.in = options.in;
    }
    applyFilter(options);
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
}

function applyDefaults(options, inputOptions) {
    if (!options) {
        throw new Error("Options is required");
    }
    inputOptions = inputOptions || {};
    var keys = Object.keys(defaults);
    inputOptions = _.pick(inputOptions, keys);
    _.defaults(options, inputOptions, defaults);
}

function ensureObjectExists(options) {
    if (!options.displayName) {
        throw new Error("displayName is required.");
    }
    if (!options.object) {
        throw new Error(options.displayName + " is required.");
    }
    if (!_.isObject(options.object)) {
        throw new Error(options.displayName + " must be an object");
    }
}

function cloneObject(options) {
    options.object = _.cloneDeep(options.object);
}

function applyFilter(options) {
    if (options.filterProperties === true) {
        options.object = validator.filterDataBySchema(options.schemaKey, options.object);
    }
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
        throw new Error("Name is required");
    }
    if (!_.isString(options.object.name)) {
        throw new Error("Name must be a string");
    }
}

function ensureNotAlreadyAdded(options) {
    if (options.targetObject[options.object.name]) {
        throw new Error('There already is a ' + options.displayName.toLowerCase() + ' with the name ' + options.object.name);
    }
}

function setObjectOnTarget(options) {
    options.targetObject[options.object.name] = options.object;
}

function applyNameDeletion(options) {
    if (options.deleteNameFromCommon) {
        delete options.targetObject[options.object.name].name;
    }
}