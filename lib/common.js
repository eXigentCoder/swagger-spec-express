'use strict';
var _ = require('lodash');
var state = require('./state');
var Ajv = require('ajv');
var ajv = new Ajv();

/* eslint-disable global-require */
ajv.addSchema([
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
    _validate: validate,
    _addToCommon: addToCommon

};

function addTag(tag) {
    tag = tag || {};
    validate('tag', tag);
    addToCommon({
        object: tag,
        targetObject: state.common.tags,
        itemType: 'tag'
    });
}

function addHeaderParameter(header) {
    header = header || {};
    header.in = 'header';
    validate('header-parameter-sub-schema', header);
    addToCommon({
        object: header,
        targetObject: state.common.parameters.header,
        itemType: 'header parameter'
    });
}

function addBodyParameter(body) {
    body = body || {};
    body.in = 'body';
    validate('body-parameter', body);
    addToCommon({
        object: body,
        targetObject: state.common.parameters.body,
        itemType: 'body parameter'
    });
}

function addQueryParameter(query) {
    query = query || {};
    query.in = 'query';
    validate('query-parameter-sub-schema', query);
    addToCommon({
        object: query,
        targetObject: state.common.parameters.query,
        itemType: 'query parameter'
    });
}

function addFormDataParameter(formData) {
    formData = formData || {};
    formData.in = 'formData';
    validate('form-data-parameter-sub-schema', formData);
    addToCommon({
        object: formData,
        targetObject: state.common.parameters.formData,
        itemType: 'formData parameter'
    });
}

function addPathParameter(path) {
    path = path || {};
    path.in = 'path';
    validate('path-parameter-sub-schema', path);
    addToCommon({
        object: path,
        targetObject: state.common.parameters.path,
        itemType: 'path parameter'
    });
}

function addResponse(response) {
    response = response || {};
    validate('response', response);
    addToCommon({
        object: response,
        targetObject: state.common.parameters.responses,
        itemType: 'response'
    });
}

function addResponseHeader(header) {
    header = header || {};
    validate('header', header);
    addToCommon({
        object: header,
        targetObject: state.common.responseHeaders,
        itemType: 'header response',
        deleteNameWhenDone: true
    });
}

function addModel(modelInput) {
    var model = _.cloneDeep(modelInput);
    validate('definitions', model);
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

function validate(name, data) {
    var valid = ajv.validate(name, data);
    if (!valid) {
        throw new Error(getErrorMessage(ajv.errors));
    }
}

function addToCommon(options) {
    options.targetObject[options.object.name] = _.cloneDeep(options.object);
    if (options.deleteNameWhenDone) {
        delete options.targetObject[options.object.name].name;
    }
}

function getErrorMessage(errors) {
    var text = ajv.errorsText(errors);
    if (text.indexOf('should NOT have additional properties') < 0) {
        return text;
    }
    errors.forEach(function (error) {
        text += '. Property : ' + error.params.additionalProperty;
    });
    return text;
}