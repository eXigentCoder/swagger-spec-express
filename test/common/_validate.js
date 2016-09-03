'use strict';
require('../init');
var _validate = require('../../lib/common')._validate;
var schemaIds = require('../../lib/schema-ids');
describe('Common', function () {
    describe('_validate', function () {
        runCommonTestsForType('body', schemaIds.parameter.body, validBody);
        runCommonTestsForType('formData', schemaIds.parameter.formData, validFormDataParameter);
        runCommonTestsForType('headerParameter', schemaIds.parameter.header, validHeaderParameter);
        runCommonTestsForType('path', schemaIds.parameter.path, validPathParameter);
        runCommonTestsForType('query', schemaIds.parameter.query, validQueryParameter);
        runCommonTestsForType('model', schemaIds.schema, validModel);
        runCommonTestsForType('response', schemaIds.response, validResponse);
        runCommonTestsForType('tag', schemaIds.tag, validTag);
        runCommonTestsForType('header', schemaIds.header, validHeader);

    });
});

function runCommonTestsForType(name, schemaId, fn) {
    describe(name, function () {
        it('Should not throw an exception if validOptions are supplied', function () {
            expect(validate(schemaId, fn()), name).to.not.throw();
        });
        it('Should throw an exception if no object is supplied', function () {
            expect(validate(schemaId, null), name).to.throw();
        });
        it('Should throw an exception if an empty object is supplied', function () {
            expect(validate(schemaId, {}), name).to.throw();
        });
        it('Should throw an exception if extra parameters are supplied (removeAdditional:false)', function () {
            var object = fn();
            object.spacePotato = true;
            expect(validate(schemaId, object), name).to.throw();
        });
        it('Should throw an exception if name is missing', function () {
            var object = fn();
            delete object.name;
            expect(validate(schemaId, object), name).to.throw();
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
