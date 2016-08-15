'use strict';
var generate = require('./generate');
var _ = require('lodash');
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
    ensureInitialised();
    ensureHasName(model, name, 'model');
    state.common.models[model.name] = model;
    delete model.name;
}

function addTag(name, tag) {
    addToCommon(name, tag, state.common.tags, 'tag');
}

function addHeaderParameter(name, header) {
    addToCommon(name, header, state.common.parameters.header, 'header parameter');
}

function addBodyParameter(name, body) {
    addToCommon(name, body, state.common.parameters.body, 'body parameter');
}

function addQueryParameter(name, query) {
    addToCommon(name, query, state.common.parameters.query, 'query parameter');
}

function addFormDataParameter(name, formData) {
    addToCommon(name, formData, state.common.parameters.formData, 'formData parameter');
}

function addPathParameter(name, path) {
    addToCommon(name, path, state.common.parameters.path, 'path parameter');
}

function addResponse(name, response) {
    addToCommon(name, response, state.common.responses, 'response');
}

function addResponseHeader(name, header) {
    addToCommon(name, header, state.common.responseHeaders, 'header response');
}

function addToCommon(name, item, target, itemType) {
    if (!item && _.isObject(name)) {
        item = name;
        name = null;
    }
    ensureInitialised();
    ensureHasName(item, name, itemType);
    target[item.name] = item;
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