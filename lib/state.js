'use strict';
var state = {
    reset: reset
};

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
            path: {},
            responses: {}
        },
        responses: {},
        responseHeaders: {},
        defaultSecurity: null
    };
    state.options = null;
    state.document = null;
}
reset();
module.exports = state;