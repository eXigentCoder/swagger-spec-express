'use strict';
var async = require('async');
var mapMetadataToOperation = require('./map-metadata-to-operation');
var getSwaggerDataFromRouteStack = require('./get-swagger-data-from-route-stack');

module.exports = function generateSwagger(state) {
    var document = state.options.document || defaultDocument();
    applyOptionsToDocument(state.options, document);
    addToDocument(state.common.models, document, 'definitions');
    addToDocumentAsArray(state.common.tags, document, 'tags');

    // See the todo list in the README.md
    // addToDocument(state.common.responses, document, 'responses');
    // addToDocument(state.common.parameters.header, document, 'parameters');
    // addToDocument(state.common.parameters.body, document, 'parameters');
    // addToDocument(state.common.parameters.query, document, 'parameters');
    // addToDocument(state.common.parameters.formData, document, 'parameters');
    // addToDocument(state.common.parameters.path, document, 'parameters');

    var filteredRoutes = getSwaggerDataFromRouteStack(state.expressRoutes);
    var operations = filteredRoutes.map(async.apply(mapMetadataToOperation, state.common));
    operations.forEach(addOperationToDocument);

    function addOperationToDocument(operation) {
        if (!document.paths[operation.path]) {
            document.paths[operation.path] = {};
        }
        document.paths[operation.path][operation.verb] = operation;
        delete operation.path;
        delete operation.verb;
    }

    return document;
};

function defaultDocument() {
    return {
        swagger: "2.0",
        info: {
            title: "",
            version: "",
            description: "",
            termsOfService: ""
        }
    };
}

function applyOptionsToDocument(options, document) {
    document.info = document.info || {};
    document.info.title = document.info.title || options.title;
    document.info.version = document.info.version || options.version;
    document.info.description = document.info.description || options.description || "";
    document.info.termsOfService = document.info.termsOfService || options.termsOfService || "";
    document.info.contact = document.info.contact || options.contact || null;
    document.info.license = document.info.license || options.license || null;
    document.host = document.host || options.host || "";
    document.basePath = document.basePath || options.basePath || "/";
    document.schemes = document.schemes || options.schemes || [];
    document.consumes = document.consumes || options.consumes || [];
    document.produces = document.produces || options.produces || [];
    document.paths = document.paths || {};
    document.definitions = document.definitions || {};
    document.parameters = document.parameters || {};
    document.responses = document.responses || {};
    document.security = document.security || options.security || [];
    document.securityDefinitions = document.securityDefinitions || options.securityDefinitions || {};
    document.tags = document.tags || [];
    document.externalDocs = document.externalDocs || {};
}

function addToDocument(data, document, documentKey) {
    Object.keys(data).forEach(function (key) {
        document[documentKey][key] = data[key];
    });
}

function addToDocumentAsArray(data, document, documentKey) {
    Object.keys(data).forEach(function (key) {
        document[documentKey].push(data[key]);
    });
}