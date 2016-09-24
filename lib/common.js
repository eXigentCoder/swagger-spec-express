'use strict';
// @flow
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

var defaults = {
    validation: 'throw', //warn, ignore,
    deleteNameFromCommon: false
};

function addTag(data, options) {
    addToCommon({
        schemaKey: schemaIds.tag,
        object: data,
        targetObject: state.common.tags,
        displayName: 'Tag'
    }, options);
}

function addHeaderParameter(data, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.header,
        in: 'header',
        object: data,
        targetObject: state.common.parameters.header,
        displayName: 'header parameter'
    }, options);
}

function addBodyParameter(data, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.body,
        in: 'body',
        object: data,
        targetObject: state.common.parameters.body,
        displayName: 'body parameter'
    }, options);
}

function addQueryParameter(data, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.query,
        in: 'query',
        object: data,
        targetObject: state.common.parameters.query,
        displayName: 'query parameter'
    }, options);
}

function addFormDataParameter(data, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.formData,
        in: 'formData',
        object: data,
        targetObject: state.common.parameters.formData,
        displayName: 'formData parameter'
    }, options);
}

function addPathParameter(data, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.path,
        in: 'path',
        object: data,
        targetObject: state.common.parameters.path,
        displayName: 'path parameter'
    }, options);
}

function addResponse(data, options) {
    addToCommon({
        schemaKey: schemaIds.response,
        object: data,
        targetObject: state.common.responses,
        displayName: 'response'
    }, options);
}

function addResponseHeader(data, options) {
    addToCommon({
        schemaKey: schemaIds.header,
        object: data,
        targetObject: state.common.responseHeaders,
        displayName: 'header response',
        deleteNameFromCommon: true
    }, options);
}


function addModel(data, inputOptions) {
    var options = {
        schemaKey: schemaIds.schema,
        object: data,
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
    var existingObject = options.targetObject[options.object.name];
    if (existingObject) {
        existingObject.name = options.object.name;
        if (!_.isEqual(existingObject, options.object)) {
            throw new Error('There already is a ' + options.displayName.toLowerCase() + ' with the name '
                + options.object.name + " and the objects themselves were not equal. Existing " + JSON.stringify(existingObject)
                + " Object to add :" + JSON.stringify(options.object));
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
}