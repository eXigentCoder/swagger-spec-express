'use strict';
var _ = require('lodash');
var state = require('./state');
var Ajv = require('ajv');
var ajv = new Ajv();

/* eslint-disable global-require */
var validate = ajv.addSchema([
    require('./schemas/body-parameter.json'),
    require('./schemas/form-data-parameter-sub-schema.json'),
    require('./schemas/header-parameter-sub-schema.json'),
    require('./schemas/path-parameter-sub-schema.json'),
    require('./schemas/query-parameter-sub-schema.json')
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
    _addToCommon: addToCommon,
    _validateAgainstSchema: validateAgainstSchema,
    _validateAndFixNameAndObjectParameters: validateAndFixNameAndObjectParameters
};

function addTag(name, tag) {
    addToCommon({
        name: name,
        object: tag,
        targetObject: state.common.tags,
        itemType: 'tag'
    });
}

function addHeaderParameter(name, header) {
    addToCommon({
        name: name,
        object: header,
        targetObject: state.common.parameters.header,
        itemType: 'header parameter',
        transformFunction: setInPropertyTo('header')
    });
}

function addBodyParameter(name, body) {
    addToCommon({
        name: name,
        object: body,
        targetObject: state.common.parameters.body,
        itemType: 'body parameter',
        transformFunction: setInPropertyTo('body')
    });
}

function addQueryParameter(name, query) {
    addToCommon({
        name: name,
        object: query,
        targetObject: state.common.parameters.query,
        itemType: 'query parameter',
        transformFunction: setInPropertyTo('query')
    });
}

function addFormDataParameter(name, formData) {
    addToCommon({
        name: name,
        object: formData,
        targetObject: state.common.parameters.formData,
        itemType: 'formData parameter',
        transformFunction: setInPropertyTo('formData')
    });
}

function addPathParameter(name, path) {
    addToCommon({
        name: name,
        object: path,
        targetObject: state.common.parameters.path,
        itemType: 'path parameter',
        transformFunction: setInPropertyTo('path')
    });
}

function addResponse(name, response) {
    addToCommon({
        name: name,
        object: response,
        targetObject: state.common.parameters.responses,
        itemType: 'response'
    });
}

function addResponseHeader(name, header) {
    addToCommon({
        name: name,
        object: header,
        targetObject: state.common.responseHeaders,
        itemType: 'header response',
        deleteNameWhenDone: true
    });
}

function addToCommon(options) {
    validateAgainstSchema(options);
    validateAndFixNameAndObjectParameters(options);
    if (options.transformFunction) {
        if (!_.isFunction(options.transformFunction)) {
            throw new Error("Transform " + options.transformFunction.toString() + "is not a function : " + JSON.stringify(options.transformFunction));
        }
        options.transformFunction(options.object);
    }
    ensureHasName(options);
    options.targetObject[options.object.name] = options.object;
    if (options.deleteNameWhenDone) {
        delete options.object.name;
    }
}

function validateAgainstSchema(options) {
    var valid = validate(options);
    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }
}

function validateAndFixNameAndObjectParameters(options) {
    var nameIsString = _.isString(options.name);
    var objectIsObject = _.isObject(options.object);
    if (nameIsString && objectIsObject) {
        return;
    }
    var nameIsObject = _.isString(options.name);
    var objectIsString = _.isObject(options.object);
    if (nameIsObject && objectIsString) {
        var tempName = options.object;
        options.object = options.name;
        options.name = tempName;
        return;
    }
    if (!nameIsObject && !objectIsObject) {
        throw new Error("You must include at least one object when adding a common " + options.itemType);
    }
    if (nameIsObject && objectIsObject) {
        throw new Error("You can't pass two objects when adding a common " + options.itemType);
    }
    if (objectIsObject) {
        if (!options.object.name) {
            throw new Error("Object must have a name property when adding a common " + options.itemType);
        }
        options.name = options.object.name;
        if (!_.isString(options.name)) {
            throw new Error("Object.name property must be a string when adding a common " + options.itemType);
        }
        return;
    }
    if (!options.name.name) {
        throw new Error("Object must have a name property when adding a common " + options.itemType);
    }
    var tempObject = options.name;
    options.name = options.name.name;
    if (!_.isString(options.name)) {
        throw new Error("Object.name property must be a string when adding a common " + options.itemType);
    }
    options.object = tempObject;
}

function setInPropertyTo(inValue) {
    return function (item) {
        item.in = inValue;
    };
}

function ensureHasName(options) {
    if (options.name) {
        if (!options.item.name) {
            options.item.name = options.name;
        }
        return;
    }
    if (!options.item.name) {
        throw new Error("Name is required when adding a " + options.itemType);
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