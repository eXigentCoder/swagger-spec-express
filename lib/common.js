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

function addTag(data) {
    addToCommon({
        schemaKey: 'tag',
        object: data,
        targetObject: state.common.tags,
        displayName: 'Tag'
    });
}

function addHeaderParameter(data) {
    addToCommon({
        schemaKey: 'header-parameter-sub-schema',
        in: 'header',
        object: data,
        targetObject: state.common.parameters.header,
        displayName: 'header parameter'
    });
}

function addBodyParameter(data) {
    addToCommon({
        schemaKey: 'body-parameter',
        in: 'body',
        object: data,
        targetObject: state.common.parameters.body,
        displayName: 'body parameter'
    });
}

function addQueryParameter(data) {
    addToCommon({
        schemaKey: 'query-parameter-sub-schema',
        in: 'query',
        object: data,
        targetObject: state.common.parameters.query,
        displayName: 'query parameter'
    });
}

function addFormDataParameter(data) {
    addToCommon({
        schemaKey: 'form-data-parameter-sub-schema',
        in: 'formData',
        object: data,
        targetObject: state.common.parameters.formData,
        displayName: 'formData parameter'
    });
}

function addPathParameter(data) {
    addToCommon({
        schemaKey: 'path-parameter-sub-schema',
        in: 'path',
        object: data,
        targetObject: state.common.parameters.path,
        displayName: 'path parameter'
    });
}

function addResponse(data) {
    addToCommon({
        schemaKey: 'response',
        object: data,
        targetObject: state.common.parameters.responses,
        displayName: 'response'
    });
}

function addResponseHeader(data) {
    addToCommon({
        schemaKey: 'header',
        object: data,
        targetObject: state.common.responseHeaders,
        displayName: 'header response',
        deleteNameWhenDone: true
    });
}


function addModel(modelInput) {
    var schemaKey = 'schema';
    var displayName = 'Model';
    ensureObjectExists(displayName, modelInput);
    var model = _.cloneDeep(modelInput);
    var definitions = model.definitions;
    delete model.definitions;
    model = validator.filterDataBySchema(schemaKey, model);
    validator.ensureValid(schemaKey, model);
    var existingDefinition = state.common.models[model.name];
    if (existingDefinition) {
        throw new Error("Unable to add model with name " + model.name
            + " because it already existed. Existing: " + JSON.stringify(existingDefinition, null, 4)
            + " attempted to add :" + JSON.stringify(model, null, 4));
    }
    state.common.models[model.name] = model;
    delete model.name;
    delete model.$schema;
    if (!definitions) {
        return;
    }
    Object.keys(definitions).forEach(function (key) {
        var definition = definitions[key];
        addModel(key, definition);
    });
}

function addToCommon(options) {
    ensureObjectExists(options.displayName, options.object);
    if (!_.isNil(options.in)) {
        options.object.in = options.in;
    }
    options.object = validator.filterDataBySchema(options.schemaKey, options.object);
    validator.ensureValid(options.schemaKey, options.object);
    if (options.targetObject[options.object.name]) {
        throw new Error('There already is a ' + options.displayName.toLowerCase() + ' with the name ' + options.object.name);
    }
    options.targetObject[options.object.name] = _.cloneDeep(options.object);
    if (options.deleteNameWhenDone) {
        delete options.targetObject[options.object.name].name;
    }
}

function ensureObjectExists(displayName, data) {
    if (!data) {
        throw new Error(displayName + " is required.");
    }
    if (!_.isObject(data)) {
        throw new Error(displayName + " must be an object");
    }
}