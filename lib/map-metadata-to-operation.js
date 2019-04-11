'use strict';
var _ = require('lodash');
var statuses = require('statuses');
var getPathParameters = require('./get-path-parameters');

module.exports = function mapSwaggerDataToOperation(stateCommon, metadata) {
    var operation = constructOperation(metadata);
    applyBasicMetadataToOperation(metadata, operation);
    getPathParameters(metadata, stateCommon);
    convertPathParametersFromExpressToSwagger(metadata);
    addPathToOperation(metadata, operation);
    addSecurity(metadata, operation, stateCommon);
    addCommonResponses(metadata, operation, stateCommon);
    addMetadataResponses(metadata, operation, stateCommon);
    addMetadataParameters(metadata, operation, stateCommon);
    addCommonParameters(metadata, operation, stateCommon);
    return operation;
};

function constructOperation(metadata) {
    return {
        tags: metadata.tags || [],
        summary: metadata.summary,
        description: metadata.description || "",
        responses: {},
        parameters: [],
        verb: metadata.verb
    };
}

function applyBasicMetadataToOperation(metadata, operation) {
    if (metadata.externalDocs) {
        operation.externalDocs = metadata.externalDocs;
    }
    if (metadata.operationId) {
        operation.operationId = metadata.operationId;
    }
    if (metadata.consumes) {
        operation.consumes = metadata.consumes;
    }
    if (metadata.produces) {
        operation.produces = metadata.produces;
    }
    if (metadata.deprecated) {
        operation.deprecated = true;
    }
}

function convertPathParametersFromExpressToSwagger(metadata) {
    metadata.path = normalisePath(metadata.path);
    function normalisePath(inputPath) {
        var pathArr = inputPath.split('/');
        for (var i = 0; i < pathArr.length; i++) {
            if (pathArr[i].substring(0, 1) === ":") {
                pathArr[i] = "{" + pathArr[i].substring(1) + "}";
            }
        }
        return pathArr.join('/');
    }
}

function addPathToOperation(metadata, operation) {
    operation.path = metadata.path;
}

function addSecurity(metadata, operation, stateCommon) {
    if (!metadata.security) {
        return;
    }
    if (metadata.security === true) {
        if (!stateCommon.defaultSecurity) {
            throw new Error("Can't set security to true if there is common.defaultSecurity is not set");
        }
        metadata.security = stateCommon.defaultSecurity;
    }
    if (_.isArray(metadata.security)) {
        operation.security = metadata.security;
        return;
    }
    if (_.isString(metadata.security)) {
        var specifiedSecurity = {};
        specifiedSecurity[metadata.security] = [];
        operation.security = [specifiedSecurity];
        return;
    }
    if (_.isObject(metadata.security)) {
        operation.security = [metadata.security];
        return;
    }
    throw new Error("Unsupported security option : " + metadata.security);
}

function addCommonResponses(metadata, operation, stateCommon) {
    if (!metadata.common) {
        return;
    }
    if (!metadata.common.responses) {
        return;
    }
    for (var i = 0; i < metadata.common.responses.length; i++) {
        var name = metadata.common.responses[i];
        var response = _.cloneDeep(stateCommon.responses[name]);
        if (!response) {
            throw new Error("Common responses did not have a response with the key " + name);
        }
        addResponse(name, response, operation, stateCommon);
    }
}

function addMetadataResponses(metadata, operation, stateCommon) {
    if (metadata.responses) {
        Object.keys(metadata.responses).forEach(function (code) {
            addResponse(code, metadata.responses[code], operation, stateCommon);
        });
    }
}

function addResponse(code, response, operation, stateCommon) {
    if (response.code) {
        code = response.code;
        delete response.code;
    }
    operation.responses[code] = response;
    delete response.name;
    response.description = response.description || getResponseDescription(code);
    addModelToResponse(response);
    addHeaderToResponse(response, stateCommon);
}

function addModelToResponse(response) {
    if (!response.model && !response.arrayOfModel) {
        return;
    }
    if (response.model && response.arrayOfModel) {
        throw new Error("Cannot set both model and arrayOfModel on a response" + JSON.stringify(response));
    }
    if (response.schema) {
        throw new Error("Cannot set schema as well as a model or arrayOfModel on a response" + JSON.stringify(response));
    }
    if (response.model) {
        response.schema = {
            $ref: "#/definitions/" + response.model
        };
        delete response.model;
        return;
    }
    response.schema = {
        type: "array",
        items: {
            $ref: "#/definitions/" + response.arrayOfModel
        }
    };
    delete response.arrayOfModel;
}

function addHeaderToResponse(response, stateCommon) {
    if (!response.commonHeaders) {
        return;
    }
    if (!_.isArray(response.commonHeaders)) {
        throw new Error("Header property commonHeaders must be an array" + JSON.stringify(response));
    }
    response.commonHeaders.forEach(function (headerName) {
        response.headers = response.headers || {};
        if (response.headers[headerName]) {
            return;
        }
        var foundHeader = stateCommon.responseHeaders[headerName];
        if (!foundHeader) {
            throw new Error("Common header by the name of " + headerName + " could not be found for response : " + JSON.stringify(response));
        }
        response.headers[headerName] = foundHeader;
    });
    delete response.commonHeaders;
}

function getResponseDescription(code) {
    if (!code) {
        return "";
    }
    var codeNumber = Number(code);
    if (Number.isNaN(codeNumber)) {
        return "";
    }
    return statuses[codeNumber];
}

function addCommonParameters(metadata, operation, stateCommon) {
    delete operation.addedParameters;
    if (!metadata.common) {
        return;
    }
    if (!metadata.common.parameters) {
        return;
    }
    addCommonParametersOfType(metadata.common.parameters.header, 'header', stateCommon, operation);
    addCommonParametersOfType(metadata.common.parameters.body, 'body', stateCommon, operation);
    addCommonParametersOfType(metadata.common.parameters.query, 'query', stateCommon, operation);
    addCommonParametersOfType(metadata.common.parameters.formData, 'formData', stateCommon, operation);
    addCommonParametersOfType(metadata.common.parameters.path, 'path', stateCommon, operation);
}

function addMetadataParameters(metadata, operation) {
    if (!metadata.parameters) {
        return;
    }
    if (!_.isArray(metadata.parameters)) {
        throw new Error("metadata parameters is not an array : " + JSON.stringify(metadata.parameters));
    }
    metadata.parameters.forEach(function (parameter) {
        addParameterToOperation(parameter, operation);
    });
}

function addCommonParametersOfType(parameters, parameterTypeKey, stateCommon, operation) {
    if (!parameters) {
        return;
    }
    if (!_.isArray(parameters)) {
        throw new Error("Common parameter is not an array : " + JSON.stringify(parameters));
    }
    if (!stateCommon.parameters) {
        throw new Error("Can't specify common parameters on a route if you have not added any common parameters. Parameters : " + JSON.stringify(parameters));
    }
    parameters.forEach(function (parameterName) {
        var commonParam = stateCommon.parameters[parameterTypeKey][parameterName];
        if (!commonParam) {
            throw new Error("Unable to find a common parameter of type " + parameterTypeKey + " with the name " + parameterName);
        }
        commonParam = _.cloneDeep(commonParam);
        addParameterToOperation(commonParam, operation, true);
    });
}

function addParameterToOperation(parameter, operation, isCommonParam) {
    var parameterType = parameter.in;
    if (!parameterType) {
        throw new Error("Parameter must have an 'in' property : " + JSON.stringify(parameter));
    }
    if (!parameter.name) {
        throw new Error("Parameter must have a 'name' property : " + JSON.stringify(parameter));
    }
    operation.addedParameters = operation.addedParameters || {};
    operation.addedParameters[parameterType] = operation.addedParameters[parameterType] || {};
    if (isCommonParam && operation.addedParameters[parameterType][parameter.name]) {
        return;
    }
    operation.addedParameters[parameterType][parameter.name] = true;
    replaceModelInParameter(parameterType, parameter);
    setDefaultsOnParameter(parameter);
    operation.parameters.push(parameter);
}

function replaceModelInParameter(parameterType, parameter) {
    if (parameter.model || parameter.arrayOfModel) {
        if (parameter.model && parameter.arrayOfModel) {
            throw new Error("Cannot set both model and arrayOfModel" + JSON.stringify(parameter));
        }
        if (parameterType !== 'body') {
            throw new Error("Can't specify parameter.model or parameter.arrayOfModel if the parameter is not a body parameter. " + JSON.stringify(parameter));
        }
        if (parameter.model) {
            parameter.schema = {
                $ref: "#/definitions/" + parameter.model
            };
            delete parameter.model;
        }
        if (parameter.arrayOfModel) {
            parameter.schema = {
                type: "array",
                items: {
                    $ref: "#/definitions/" + parameter.arrayOfModel
                }
            };
            delete parameter.arrayOfModel;
        }
    }
}

function setDefaultsOnParameter(parameter) {
    if (parameter.in !== 'body') {
        parameter.type = parameter.type || "string";
    }
    if (_.isNull(parameter.required) || _.isUndefined(parameter.required)) {
        if (parameter.in === 'path') {
            parameter.required = true;
        }
        else {
            parameter.required = false;
        }
    }
    if (parameter.in === 'body' && !parameter.schema) {
        throw new Error("If you add a body parameter, schema must be populated" + JSON.stringify(parameter));
    }
    if (parameter.type === "array" && !parameter.items) {
        throw new Error("If parameter type is array you must set the items property" + JSON.stringify(parameter));
    }
}