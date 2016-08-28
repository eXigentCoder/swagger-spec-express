'use strict';
require('./../init');
var generate = require('../../lib/generate');
var express = require('express');
var swagger = require('../../lib/index');
describe('generate', function () {
    describe('_applyOptionsToDocument', function () {
        it('Should make an info property on the document if one is not provided', function () {
            generate._applyOptionsToDocument({}, {});
        });
        it('Should make a document if one is not provided', function () {
            generate._applyOptionsToDocument(allOptions(), generate._defaultDocument());
        });
    });
    describe('_addToDocument', function () {
        it('Should add the models to the document if there are any', function () {
            var document = getDocument();
            var models = getModels();
            generate._addToDocument(models, document, 'definitions');
        });
        it('Should add the models to the document even if the models are empty', function () {
            var document = getDocument();
            var models = {};
            generate._addToDocument(models, document, 'definitions');
        });
        it("Should make the property on the document if it didn't already exist", function () {
            var document = getDocument();
            var models = getModels();
            generate._addToDocument(models, document, 'definitions2');
        });
    });
    describe('_addToDocumentAsArray', function () {
        it('Should add the models to the document if there are any', function () {
            var document = getDocument();
            var models = getModels();
            generate._addToDocumentAsArray(models, document, 'tags');
        });
        it('Should add the models to the document even if the models are empty', function () {
            var document = getDocument();
            var models = {};
            generate._addToDocumentAsArray(models, document, 'tags');
        });
        it("Should make the property on the document if it didn't already exist", function () {
            var document = getDocument();
            var models = getModels();
            generate._addToDocumentAsArray(models, document, 'tags2');
        });
    });
    describe('generate', function () {
        it('Should work if you pass in a valid sate', function () {
            setupExampleApp();
            swagger.compile();
        });
    });
});

function setupExampleApp() {
    swagger.reset();
    var app = express();
    swagger.initialise(app, allOptions());
    app.get('/', exampleRoute).describe(exampleMetadata());
}
function exampleRoute(req, res) {
    res.status(200).json({test: true});
}
function exampleMetadata() {
    return {
        responses: {
            200: {
                description: "Success!"
            }
        }
    };
}

function getModels() {
    return {
        model1: {
            model1: true
        },
        model2: {
            model2: true
        }
    };
}

function getDocument() {
    var document = generate._defaultDocument();
    generate._applyOptionsToDocument(allOptions(), document);
    return document;
}

function allOptions() {
    return {
        title: "Test Title",
        description: "Test description",
        termsOfService: "Don't spam me!",
        contact: {
            name: "Ryan",
            url: "http://blog.exigentcoder.com/",
            email: "exigentcoder@gmail.com"
        },
        license: {
            name: "MIT",
            url: "https://en.wikipedia.org/wiki/MIT_License"
        },
        version: "1.0.0",
        host: "localhost:3000",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        definitions: {},
        parameters: {},
        responses: {},
        security: [],
        tags: [{
            name: "testTag"
        }],
        externalDocs: {
            url: "https://www.google.co.za"
        },
        defaultSecurity: "basicAuth",
        securityDefinitions: {
            basicAuth: {
                type: "basic",
                description: "HTTP Basic Authentication. Works over HTTPS"
            }
        }
    };
}