'use strict';
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var $RefParser = require('json-schema-ref-parser');
var generateComment = require('./generate-comment');

/**
 * Takes a json schema file and injects the information as a jsdoc comment at the target
 * @param {object} options the options to use when injecting the schema
 * @param {object} options.schema The schema object to use to generate the comment string
 * @param {string} options.filePath The path to the file where the jsdoc comment should be injected
 * @param {string} options.target The line to search for in the file. The jsdoc comment will get added above this.
 * @param {string} options.indentation The indentation to use. Default : ' * '
 * @param {function} callback the callback to call when done.
 * @return {void}
 */
module.exports = function injectSchema(options, callback) {
    async.waterfall([
        async.apply(validateOptions, options),
        derefSchema,
        loadFile,
        generateComment,
        writeFile
    ], callback);
};

function validateOptions(options, callback) {
    if (!_.isObject(options.schema)) {
        return callback(new Error("Schema must be an object"));
    }
    if (!_.isString(options.filePath)) {
        return callback(new Error("FilePath must be a string"));
    }
    options.filePath = options.filePath.trim();
    if (_.isNil(options.filePath) || options.filePath === '') {
        return callback(new Error("FilePath cannot be blank"));
    }
    if (!_.isString(options.target)) {
        return callback(new Error("Target must be a string"));
    }
    options.target = options.target.trim();
    if (_.isNil(options.target) || options.target === '') {
        return callback(new Error("Target cannot be blank"));
    }
    callback(null, options);
}

function loadFile(options, callback) {
    fs.readFile(options.filePath, {encoding: 'utf8'}, function (err, content) {
        options.fileContent = content;
        callback(err, options);
    });
}
function derefSchema(options, callback) {
    $RefParser.dereference(options.schema, function (err, fullSchema) {
        if (err) {
            return callback(err);
        }
        options.schema = fullSchema;
        delete options.schema.definitions;
        return callback(null, options);
    });
}

function writeFile(options, callback) {
    callback(null, options);
}