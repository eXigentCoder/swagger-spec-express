'use strict';
var Ajv = require('ajv');
var request = require('request');
var _ = require('lodash');
var schema = require('swagger-schema-official/schema.json');
var _validate;
var _ajv;
module.exports = {
    initialise: initialise,
    validate: validate
};

function initialise(callback) {
    var options = {
        loadSchema: loadSchema
    };
    _ajv = new Ajv(options);
    _ajv.compileAsync(schema, compiled);

    function compiled(err, compiledValidate) {
        if (err) {
            return callback(err);
        }
        _validate = compiledValidate;
        return callback();
    }
}

function loadSchema(uri, callback) {
    request.json(uri, schemaLoaded);

    function schemaLoaded(err, res, body) {
        if (err || res.statusCode >= 400) {
            return callback(err || new Error('Error loading remote schema from uri(' + uri + '): ' + res.statusCode + '. Response body: ' + JSON.stringify(body)));
        }
        callback(null, body);
    }
}


function validate(documentInput) {
    var document = _.cloneDeep(documentInput);
    var result = {};
    try {
        result.valid = _validate(document);
    }
    catch (err) {
        result.valid = false;
        result.errors = [err];
        result.text = "Sorry, an error has occurred while validating your swagger document.";
    }
    if (!result.valid) {
        result.errors = _validate.errors;
        result.text = _ajv.errorsText(_validate.errors);
    }
    return result;
}