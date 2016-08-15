'use strict';
var generate = require('./generate');
var state;

module.exports = {
    initialise: initialise,
    compile: compile,
    json: json,
    reset: reset,
    common: {
        addModel: addModel,
        addTag: addTag,
        parameters: {
            addHeader: addHeaderParameter,
            addBody: addBodyParameter,
            addQuery: addQueryParameter,
            addFormData: addFormDataParameter,
            addPath: addPathParameter
        },
        addResponse: addResponse,
        addResponseHeader: addResponseHeader
    },
    swaggerize: swaggerize
};

function reset() {
    state = {
        initialised: false,
        compiled: false,
        router: null,
        common: {
            models: {},
            tags: {},
            parameters: {
                header: {},
                body: {},
                query: {},
                formData: {},
                path: {}
            },
            responses: {},
            responseHeaders: {},
            defaultSecurity: null
        },
        document: null
    };
}

function initialise(app, options, callback) {
    reset();
    if (!app) {
        return callback(new Error("options.app must be set when calling initialise"));
    }
    if (!app._router) {
        return callback(new Error("options.app._router was null, either your app is not an express app or you have called initialise before adding at least one route"));
    }
    state.router = app._router;
    state.defaultSecurity = options.defaultSecurity;
    state.options = options;
    swaggerize(app);
    state.initialised = true;
    return callback();
}

function compile(callback) {
    if (!state || !state.initialised) {
        return callback(new Error("Initialise must be called before you can compile the swagger spec"));
    }
    state.document = generate(state);
    state.compiled = true;
    return callback();
}

function json() {
    ensureInitialised();
    if (!state.compiled) {
        throw new Error("Compile must be called before you can compile the swagger spec");
    }
    return JSON.stringify(state.document, null, 4);
}

function ensureInitialised() {
    if (!state || !state.initialised) {
        throw new Error("Initialise must be called before you can compile the swagger spec");
    }
}

function ensureHasName(item, itemType) {
    if (!item.name) {
        throw new Error("Name is required when adding a " + itemType);
    }
}

function addModel(model) {
    ensureInitialised();
    ensureHasName(model, 'model');
    state.common.models[model.name] = model;
}

function addTag(tag) {
    ensureInitialised();
    ensureHasName(tag, 'tag');
    state.common.tags[tag.name] = tag;
}

function addHeaderParameter(header) {
    ensureInitialised();
    ensureHasName(header, 'header parameter');
    header.in = 'header';
    state.common.parameters.header[header.name] = header;
}

function addBodyParameter(body) {
    ensureInitialised();
    ensureHasName(body, 'body parameter');
    body.in = 'body';
    state.common.parameters.body[body.name] = body;
}

function addQueryParameter(query) {
    ensureInitialised();
    ensureHasName(query, 'query parameter');
    query.in = 'query';
    state.common.parameters.query[query.name] = query;
}

function addFormDataParameter(formData) {
    ensureInitialised();
    ensureHasName(formData, 'formData parameter');
    formData.in = 'formData';
    state.common.parameters.formData[formData.name] = formData;
}

function addPathParameter(path) {
    ensureInitialised();
    ensureHasName(path, 'path parameter');
    path.in = 'path';
    state.common.parameters.path[path.name] = path;
}

function addResponse(response) {
    ensureInitialised();
    ensureHasName(response, 'response');
    state.common.responses[response.name] = response;
}

function addResponseHeader(header) {
    ensureInitialised();
    ensureHasName(header, 'header response');
    state.common.responseHeaders[header.name] = header;
}

function swaggerize(item) {
    item.swagger = {
        describeAppRoute: describeAppRoute,
        describeRouterRoute: describeRouterRoute
    };
}

function describeRouterRoute(router, metaData) {
    var lastRoute = router.stack[router.stack.length - 1];
    if (!lastRoute.route) {
        throw new Error("Unable to add swagger metadata to last route since the last item in the stack was not a route. Route name :" + lastRoute.name + ". Metadata :" + JSON.stringify(metaData));
    }
    var verb = Object.keys(lastRoute.route.methods)[0];
    if (!verb) {
        throw new Error("Unable to add swagger metadata to last route since the last route's methods property was empty" + lastRoute.name + ". Metadata :" + JSON.stringify(metaData));
    }
    metaData.path = lastRoute.route.path;
    metaData.verb = verb;
    lastRoute.route.swaggerData = metaData;
}

function describeAppRoute(metaData) {
    return describeRouterRoute(state.router, metaData);
}