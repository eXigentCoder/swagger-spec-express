'use strict';
var mapMetadataToOperation = require('./map-metadata-to-operation');
var getSwaggerDataFromRouteStack = require('./get-swagger-data-from-route-stack');

module.exports = function generateSwagger(state) {
    var document = state.document;
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

    var filteredRoutes = getSwaggerDataFromRouteStack(state.app._router.stack);
    var operations = filteredRoutes.map(apply(mapMetadataToOperation, state.common));
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
module.exports._applyOptionsToDocument = applyOptionsToDocument;
module.exports._addToDocument = addToDocument;
module.exports._addToDocumentAsArray = addToDocumentAsArray;

function applyOptionsToDocument(options, document) {
    document.info = document.info || {};
    if (options.title) {
        document.info.title = options.title;
    }
    if (options.version) {
        document.info.version = options.version;
    }
    if (options.description) {
        document.info.description = options.description;
    }
    if (options.termsOfService) {
        document.info.termsOfService = options.termsOfService;
    }
    if (options.contact) {
        document.info.contact = options.contact;
    }
    if (options.license) {
        document.info.license = options.license;
    }
    if (options.host) {
        document.host = options.host;
    }
    document.basePath = document.basePath || options.basePath || "/";
    if (options.schemes) {
        document.schemes = options.schemes;
    }
    if (options.consumes) {
        document.consumes = options.consumes;
    }
    if (options.produces) {
        document.produces = options.produces;
    }
    document.paths = document.paths || {};
    if (options.definitions) {
        document.definitions = document.definitions || {};
    }
    if (options.parameters) {
        document.parameters = document.parameters || {};
    }
    if (options.responses) {
        document.responses = document.responses || {};
    }
    if (options.security) {
        document.security = options.security;
    }
    if (options.securityDefinitions) {
        document.securityDefinitions = options.securityDefinitions;
    }
    if (options.tags) {
        document.tags = options.tags;
    }
    if (options.externalDocs) {
        document.externalDocs = options.externalDocs;
    }
}

function addToDocument(data, document, documentKey) {
    var keys = Object.keys(data);
    if (keys.length <= 0) {
        return;
    }
    document[documentKey] = document[documentKey] || {};
    keys.forEach(function (key) {
        document[documentKey][key] = data[key];
    });
}

function addToDocumentAsArray(data, document, documentKey) {
    var keys = Object.keys(data);
    if (keys.length <= 0) {
        return;
    }
    document[documentKey] = document[documentKey] || [];
    keys.forEach(function (key) {
        document[documentKey].push(data[key]);
    });
}

function apply(fn, ...args) {
    return (...callArgs) => fn(...args,...callArgs);
}