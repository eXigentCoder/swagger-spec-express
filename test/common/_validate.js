'use strict';
require('../init');
var _validate = require('../../lib/common')._validate;
describe('Common', function () {
    describe('_validate', function () {
        runCommonTestsForType('body', 'body-parameter', validBody);
        runCommonTestsForType('formData', 'form-data-parameter-sub-schema', validFormDataParameter);
        runCommonTestsForType('header', 'header-parameter-sub-schema', validHeaderParameter);
        runCommonTestsForType('path', 'path-parameter-sub-schema', validPathParameter);
        runCommonTestsForType('query', 'query-parameter-sub-schema', validQueryParameter);
        runCommonTestsForType('model', 'schema', validModel);
        runCommonTestsForType('response', 'response', validResponse);
        runCommonTestsForType('tag', 'tag', validTag);
        runCommonTestsForType('header', 'header', validHeader);

    });
});

function runCommonTestsForType(name, schemaName, fn) {
    describe(name, function () {
        it('Should not throw an exception if validOptions are supplied', function () {
            expect(validate(schemaName, fn()), name).to.not.throw();
        });
        it('Should throw an exception if no object is supplied', function () {
            expect(validate(schemaName, null), name).to.throw();
        });
        it('Should throw an exception if an empty object is supplied', function () {
            expect(validate(schemaName, {}), name).to.throw();
        });
        it('Should throw an exception if extra parameters are supplied', function () {
            var object = fn();
            object.spacePotato = true;
            expect(validate(schemaName, object), name).to.throw();
        });
        it('Should throw an exception if name is missing', function () {
            var object = fn();
            delete object.name;
            expect(validate(schemaName, object), name).to.throw();
        });
    });
}

function validate(name, data) {
    return _validate.bind(_validate, name, data);
}

function validBody() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "body",
        required: true,
        schema: {},
        "x-potato": "space"
    };
}

function validFormDataParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "formData",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function validHeaderParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "header",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function validPathParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "path",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function validQueryParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "query",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function validModel() {
    return {
        name: "testTag",
        description: "A test tag",
        type: 'object',
        properties: {},
        "x-potato": "space"
    };
}

function validResponse() {
    return {
        name: "testTag",
        description: "A test tag",
        schema: {},
        "x-potato": "space"
    };
}

function validTag() {
    return {
        name: "testTag",
        description: "A test tag",
        externalDocs: {
            description: "Google",
            url: "https://www.google.co.za"
        },
        "x-potato": "space"
    };
}

function validHeader() {
    return {
        name: "testTag",
        description: "A test tag",
        type: "string",
        "x-potato": "space"
    };
}
