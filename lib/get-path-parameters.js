'use strict';
var _ = require('lodash');

module.exports = function getPathParameters(metadata, stateCommon) {
    var foundParameters = getPathParameterNamesFromPath(metadata.path);
    foundParameters.forEach(function addFoundParameter(parameterName) {
        if (existsInMetadataParameters(metadata.parameters, parameterName)) {
            return;
        }
        var isInState = stateCommon.parameters.path[parameterName];
        var isInCommon = findCommonParameter(metadata.common, parameterName);
        if (isInState) {
            if (isInCommon) {
                return;
            }
            return addParameterToCommon(metadata, parameterName);
        }
        if (isInCommon) {
            console.warn("Parameter name '" + parameterName + "' was specified using in the metadata.common.parameters.path array, however it was never added to the state by calling require('swagger-spec-express').common.parameters.addPath(...). Will construct a basic parameter");
        }
        addToMetadataParameters(metadata, parameterName);
    });
};

function addToMetadataParameters(metadata, parameterName) {
    var paramObject = {
        name: parameterName,
        in: 'path'
    };
    metadata.parameters = metadata.parameters || [];
    metadata.parameters.push(paramObject);
}

function existsInMetadataParameters(parameters, parameterName) {
    if (!parameters) {
        return;
    }
    return _.find(parameters, {name: parameterName});
}

function findCommonParameter(common, parameterName) {
    if (!common) {
        return;
    }
    if (!common.parameters) {
        return;
    }
    if (!common.parameters.path) {
        return;
    }
    var index = common.parameters.path.indexOf(parameterName);
    if (index < 0) {
        return;
    }
    return common.parameters.path[index];
}

function addParameterToCommon(metadata, parameterName) {
    metadata.common = metadata.common || {};
    metadata.common.parameters = metadata.common.parameters || {};
    metadata.common.parameters.path = metadata.common.parameters.path || [];
    metadata.common.parameters.path.push(parameterName);
}

function getPathParameterNamesFromPath(inputPath) {
    var params = [];
    var pathArr = inputPath.split('/');
    for (var i = 0; i < pathArr.length; i++) {
        if (pathArr[i].substring(0, 1) === ":") {
            params.push(pathArr[i].substring(1));
        }
    }
    return params;
}