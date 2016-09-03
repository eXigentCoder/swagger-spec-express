'use strict';

module.exports = function () {
    return {
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
                path: {},
                responses: {}
            },
            responses: {},
            responseHeaders: {},
            defaultSecurity: null
        },
        options: null,
        document: {
            swagger: "2.0",
            info: {}
        },
        ajvValidationOptions: {
            removeAdditional: 'failing',
            coerceTypes: true,
            allErrors: true,
            verbose: true,
            format: 'full'
        }
    };
};