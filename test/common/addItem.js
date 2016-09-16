'use strict';
require('../init');
var common = require('../../lib/common');
var validData = require('./valid-data');
describe('Common', function () {
    describe('add items', function () {
        runCommonTestsForType('body parameter', common.addBodyParameter, validData.body);
        runCommonTestsForType('formData parameter', common.addFormDataParameter, validData.formDataParameter);
        runCommonTestsForType('header parameter', common.addHeaderParameter, validData.headerParameter);
        runCommonTestsForType('path parameter', common.addPathParameter, validData.pathParameter);
        runCommonTestsForType('query parameter', common.addQueryParameter, validData.queryParameter);
        runCommonTestsForType('model', common.addModel, validData.model);
        runCommonTestsForType('response', common.addResponse, validData.response);
        runCommonTestsForType('tag', common.addTag, validData.tag);
        runCommonTestsForType('header', common.addResponseHeader, validData.header);

    });
});

function runCommonTestsForType(name, addFn, dataFn) {
    describe(name, function () {
        it('Should not throw an exception if validOptions are supplied', function () {
            expect(callAddFn(addFn, dataFn()), name).to.not.throw();
        });
        it('Should throw an exception if no object is supplied', function () {
            expect(callAddFn(addFn, null), name).to.throw();
        });
        it('Should throw an exception if an empty object is supplied', function () {
            expect(callAddFn(addFn, {}), name).to.throw();
        });
        it('Should throw an exception if extra parameters are supplied', function () {
            var object = dataFn();
            object.spacePotato = true;
            expect(callAddFn(addFn, object), name).to.throw();
        });
        it('Should throw an exception if name is missing', function () {
            var object = dataFn();
            delete object.name;
            expect(callAddFn(addFn, object), name).to.throw();
        });
        if (name === 'model') {
            it('Should not throw an exception if the model has definitions in it', function () {
                var model = dataFn();
                model.name = model.name + "2";
                model.definitions = {
                    test: {
                        type: "object",
                        properties: {
                            isTest: {
                                type: 'boolean',
                                default: true
                            }
                        },
                        additionalProperties: false,
                        required: [
                            "isTest"
                        ]
                    }
                };
                expect(callAddFn(addFn, model), name).to.not.throw();
            });
        }
    });
}

function callAddFn(addFn, data) {
    return addFn.bind(addFn, data);
}