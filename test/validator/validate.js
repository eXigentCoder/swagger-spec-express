'use strict';
require('./../init');
var async = require('async');
var validator = require('../../lib/validator');
var id = 'testSchema';
var metaDataSchema = require('../../lib/schemas/meta-data.json');

describe('Validator', function () {
    beforeEach(function () {
        validator.removeSchema(id);
    });
    describe('addSchema', function () {
        it("Should not throw an error when adding a valid schema", function () {
            expect(async.apply(validator.addSchema, testSchema())).to.not.throw();
        });
        it("Should throw an error when adding a a schema with the same id", function () {
            expect(async.apply(validator.addSchema, testSchema())).to.not.throw();
            expect(async.apply(validator.addSchema, testSchema())).to.throw();
        });
    });
    describe('validate', function () {
        it("Should not throw an error when passing a value to validate", function () {
            validator.addSchema(testSchema());
            expect(async.apply(validator.validate, id, testData())).to.not.throw();
        });
        it("Should throw an error when validating against an id that doesn't exits", function () {
            validator.addSchema(testSchema());
            expect(async.apply(validator.validate, 'asdasdqlwkhe23', testData())).to.throw();
        });
    });
    it('Bug test case, caused by usesDefaults:true', function () {
        delete metaDataSchema.$id;
        var fn = validator.compile(metaDataSchema);
        fn(exampleMetadata());
    });
});

function exampleMetadata() {
    return {
        responses: {
            "200": {
                "description": "OK",
                "schema": {
                    "$ref": "#/definitions/appInfo"
                }
            }
        }
    };
}

function testSchema() {
    return {
        $id: id,
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength: 1
            }
        },
        additionalProperties: false,
        required: [
            "name"
        ]
    };
}

function testData() {
    return {
        name: "bob"
    };
}