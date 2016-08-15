'use strict';
var _ = require('lodash');
module.exports = function mapSwaggerDataToOperation(stateCommon, metadata) {
    var operation = {
        tags: metadata.tags || [],
        summary: metadata.summary,
        description: metadata.description || "",
        responses: {},
        parameters: [],
        verb: metadata.verb
    };
    var addedQueryParamaters = {};
    var data = {
        operation: operation,
        common: stateCommon,
        metadata: metadata,
        addedQueryParamaters: addedQueryParamaters
    };
    applyMetadataToOperation(metadata, operation);
    getPathParameters(metadata);
    convertPathParametersFromExpressToSwagger(metadata);
    addPathToOperation(metadata, operation);
    addSecurity(metadata, operation, stateCommon);
    addCommonResponses(metadata, operation, stateCommon);
    addMetadataResponses(metadata, operation);
    addQueryParameters(data);
    addCommonQueries(data);
    addPathParameters(data);
    addHeaderParameters(data);
    addInput(data);
    addResponses(data);
    addParameters(data);

    return operation;
};

function applyMetadataToOperation(metadata, operation) {
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

function getPathParameters(metadata) {
    metadata.pathParameters = getParametersFromPath(metadata.path);
    function getParametersFromPath(inputPath) {
        var params = [];
        var pathArr = inputPath.split('/');
        for (var i = 0; i < pathArr.length; i++) {
            if (pathArr[i].substring(0, 1) === ":") {
                params.push(pathArr[i].substring(1));
            }
        }
        return params;
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
        operation.security = stateCommon.defaultSecurity;
        return;
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
    if (metadata.common.responses) {
        for (var i = 0; i < metadata.common.responses.length; i++) {
            var code = metadata.common.responses[i];
            var response = stateCommon.responses[code];
            if (!response) {
                throw new Error("Common responses did not have a response with the key " + code);
            }
            addResponse(code, response, operation);
        }
    }
}

function addMetadataResponses(metadata, operation) {
    if (metadata.responses) {
        Object.keys(metadata.responses).forEach(function (code) {
            addResponse(code, metadata.responses[code], operation);
        });
    }
}

function addResponse(code, response, operation) {
    operation.responses[code] = response;
    response.description = response.description || getResponseDescription(code);
    addModelToResponse(response);
}

function addModelToResponse(response) {
    if (!response.model && !response.arrayOfModel) {
        return;
    }
    if (response.model && response.arrayOfModel) {
        throw new Error("Cannot set both model and arrayOfModel");
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

function getResponseDescription(code) {
    if (!code) {
        return "";
    }
    if (code.toString() === "200") {
        return "Success";
    }
    if (code.toString() === "201") {
        return "Successfully Created";
    }
    if (code.toString() === "204") {
        return "Success No Content";
    }
    if (code.toString() === "202") {
        return "Accepted";
    }
    return "";
}

function addQueryParameters(data) {
    var operation = data.operation;
    var metadata = data.metadata;
    if (metadata.queryParameters) {
        Object.keys(metadata.queryParameters).forEach(function (queryParameterKey) {
            var swaggerQueryParameter = {
                name: queryParameterKey,
                in: "query",
                description: metadata.queryParameters[queryParameterKey].description,
                required: metadata.queryParameters[queryParameterKey].required ? metadata.queryParameters[queryParameterKey].required : false,
                type: metadata.queryParameters[queryParameterKey].type ? metadata.queryParameters[queryParameterKey].type : "string"
            };
            if (metadata.queryParameters[queryParameterKey].format) {
                swaggerQueryParameter.format = metadata.queryParameters[queryParameterKey].format;
            }
            operation.parameters.push(swaggerQueryParameter);
            data.addedQueryParamaters[queryParameterKey] = true;
        });

    }
}

function addCommonQueries(data) {
    var operation = data.operation;
    var common = data.common;
    var metadata = data.metadata;
    if (metadata.predefinedQueries) {
        for (var k = 0; k < metadata.predefinedQueries.length; k++) {
            if (common.queryParameters[metadata.predefinedQueries[k]]) {
                if (data.addedQueryParamaters[metadata.predefinedQueries[k]]) {
                    continue;
                }

                var appSwaggerQueryParameter = common.queryParameters[metadata.predefinedQueries[k]];
                var swaggerPredefinedQueryParameter = {
                    name: metadata.predefinedQueries[k],
                    in: "query",
                    description: appSwaggerQueryParameter.description,
                    required: appSwaggerQueryParameter.required ? appSwaggerQueryParameter.required : false,
                    type: appSwaggerQueryParameter.type ? appSwaggerQueryParameter.type : "string"
                };
                if (appSwaggerQueryParameter.format) {
                    swaggerPredefinedQueryParameter.format = appSwaggerQueryParameter.format;
                }
                operation.parameters.push(swaggerPredefinedQueryParameter);
            }
        }
    }
}

function addPathParameters(data) {
    var operation = data.operation;
    var common = data.common;
    var metadata = data.metadata;
    if (metadata.pathParameters) {
        for (var l = 0; l < metadata.pathParameters.length; l++) {
            if (common.pathParameters[metadata.pathParameters[l]]) {
                var appSwaggerParameter = common.pathParameters[metadata.pathParameters[l]];
                var swaggerParameter = {
                    name: metadata.pathParameters[l],
                    in: "path",
                    description: appSwaggerParameter.description,
                    required: true,
                    type: appSwaggerParameter.type ? appSwaggerParameter.type : "string"
                };
                if (appSwaggerParameter.format) {
                    swaggerParameter.format = appSwaggerParameter.format;
                }
                operation.parameters.push(swaggerParameter);
            }
        }
    }
}

function addHeaderParameters(data) {
    var operation = data.operation;
    var metadata = data.metadata;
    if (metadata.headerParametersheaderParameters) {
        Object.keys(metadata.headerParameters).forEach(function (headerKey) {
            var header = metadata.headerParameters[headerKey];
            header.in = "header";
            header.name = headerKey;
            header.description = header.description || "";
            header.required = header.required || false;
            header.type = header.type || "string";
            operation.parameters.push(header);
        });
    }
}

function addInput(data) {
    var operation = data.operation;
    var metadata = data.metadata;
    if (metadata.input) {
        if (metadata.input.model) {
            operation.parameters.push({
                in: "body",
                name: "body",
                required: true,
                schema: {$ref: "#/definitions/" + metadata.input.model}
            });
        }
        else if (metadata.input.schema) {
            operation.parameters.push({
                in: "body",
                name: "body",
                required: true,
                schema: metadata.input.schema
            });
        }
    }
}

function addResponses(data) {
    if (data.metadata.responses) {
        data.operation.responses = data.metadata.responses;
    }
}

function addParameters(data) {
    if (data.metadata.parameters) {
        data.operation.parameters = data.operation.parameters.concat(data.metadata.parameters);
    }
}