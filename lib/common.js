'use strict';
var _ = require('lodash');
var state = require('./state');

module.exports = {
    addTag: addTag,
    addHeaderParameter: addHeaderParameter,
    addBodyParameter: addBodyParameter,
    addQueryParameter: addQueryParameter,
    addFormDataParameter: addFormDataParameter,
    addPathParameter: addPathParameter,
    addResponse: addResponse,
    addResponseHeader: addResponseHeader,
    addModel: addModel
};

function addTag(name, tag) {
    addToCommon(name, tag, state.common.tags, 'tag');
}

function addHeaderParameter(name, header) {
    addToCommon(name, header, state.common.parameters.header, 'header parameter', ensureHasIn('header'));
}

function addBodyParameter(name, body) {
    addToCommon(name, body, state.common.parameters.body, 'body parameter', ensureHasIn('body'));
}

function addQueryParameter(name, query) {
    addToCommon(name, query, state.common.parameters.query, 'query parameter', ensureHasIn('query'));
}

function addFormDataParameter(name, formData) {
    addToCommon(name, formData, state.common.parameters.formData, 'formData parameter', ensureHasIn('formData'));
}

function addPathParameter(name, path) {
    addToCommon(name, path, state.common.parameters.path, 'path parameter', ensureHasIn('path'));
}

function addResponse(name, response) {
    addToCommon(name, response, state.common.responses, 'response');
}

function addResponseHeader(name, header) {
    addToCommon(name, header, state.common.responseHeaders, 'header response', null, true);
}

function addToCommon(name, item, target, itemType, transform, deleteNameWhenDone) {
    if (!item && _.isObject(name)) {
        item = name;
        name = null;
    }
    if (transform) {
        if (!_.isFunction(transform)) {
            throw new Error("Transform " + transform.toString() + "is not a function : " + JSON.stringify(transform));
        }
        transform(item);
    }
    ensureHasName(item, name, itemType);
    target[item.name] = item;
    if (deleteNameWhenDone) {
        delete item.name;
    }
}

function ensureHasIn(inValue) {
    return function (item) {
        item.in = inValue;
    };
}
function ensureHasName(item, name, itemType) {
    if (name) {
        if (!item.name) {
            item.name = name;
        }
        return;
    }
    if (!item.name) {
        throw new Error("Name is required when adding a " + itemType);
    }
}

function addModel(name, modelInput) {
    if (!modelInput && _.isObject(name)) {
        modelInput = name;
        name = null;
    }
    var model = _.cloneDeep(modelInput);
    ensureHasName(model, name, 'model');
    var existingDefinition = state.common.models[model.name];
    if (existingDefinition) {
        throw new Error("Unable to add model with name" + model.name + " because it already existed. Existing: " + JSON.stringify(existingDefinition, null, 4) + " attempted to add :" + JSON.stringify(model, null, 4));
    }
    state.common.models[model.name] = model;
    delete model.name;
    delete model.$schema;
    if (!model.definitions) {
        return;
    }
    Object.keys(model.definitions).forEach(function (key) {
        var definition = model.definitions[key];
        addModel(key, definition);
    });
    delete model.definitions;
}