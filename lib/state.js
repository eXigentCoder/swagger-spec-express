'use strict';
var state = {
    initialised: false,
    compiled: false,
    app: null,
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
    options: null,
    document: null,
    reset: reset
};
module.exports = state;

function reset() {
    state.initialised = false;
    state.compiled = false;
    state.app = null;
    state.common = {
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
    };
    state.options = null;
    state.document = null;
}