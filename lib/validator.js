'use strict';
var Ajv = require('ajv');
var ajv = new Ajv();

module.exports = {
    addSchema: ajv.addSchema,
    validate: getValidationResult,
    getErrorMessage: getErrorMessage,
    ensureValid: ensureValid
};

function ensureValid(schemaKeyRef, data) {
    var valid = ajv.validate(schemaKeyRef, data);
    if (!valid) {
        throw new Error(getErrorMessage(ajv.errors));
    }
}

function getErrorMessage(errors) {
    var text = ajv.errorsText(errors);
    if (text.indexOf('should NOT have additional properties') < 0) {
        return text;
    }
    errors.forEach(function (error) {
        text += '. Property : ' + error.params.additionalProperty;
    });
    return text;
}

function getValidationResult(schemaKeyRef, data) {
    var result = {};
    try {
        result.valid = ajv.validate(schemaKeyRef, data);
    }
    catch (err) {
        result.valid = false;
        result.errors = [err];
        result.text = "Sorry, an error has occurred while validating the schema.";
    }
    if (!result.valid) {
        result.errors = ajv.errors;
        result.text = getErrorMessage(ajv.errors);
    }
    return result;
}