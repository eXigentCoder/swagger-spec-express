'use strict';
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var $RefParser = require('json-schema-ref-parser');
var generateComment = require('./generate-comment');
var os = require('os');
var esprima = require('esprima');
var escodegen = require('escodegen');
var estreeWalker = require('estree-walker');

/**
 * Takes a json schema file and injects the information as a jsdoc comment at the target
 * @param {object} options the options to use when injecting the schema
 * @param {object} options.schema The schema object to use to generate the comment string
 * @param {string} options.filePath The path to the file where the jsdoc comment should be injected
 * @param {string} [options.indentation] The indentation to use. Default : ' * '
 * @param {function} callback the callback to call when done.
 * @return {void}
 */
module.exports = function injectSchema(options, callback) {
    async.waterfall([
        async.apply(validateOptions, options),
        derefSchema,
        loadFile,
        parseFile,
        generateComments,
        generateOutput,
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
    callback(null, options);
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

function loadFile(options, callback) {
    fs.readFile(options.filePath, {encoding: 'utf8'}, function (err, content) {
        options.fileContent = content;
        callback(err, options);
    });
}

function parseFile(options, callback) {
    var parserOptions = {
        sourceType: 'module',
        comment: false,
        attachComment: true
    };
    options.parsedFile = esprima.parse(options.fileContent, parserOptions);
    removeDuplicateComments(options.parsedFile);
    return callback(null, options);
}

function generateComments(options, callback) {
    // todo call generateComment where appropriate
    return callback(null, options);
}

function generateOutput(options, callback) {
    var generateOptions = {
        format: {
            newline: os.EOL,
            indent: {
                adjustMultilineComment: true
            },
            quotes: 'single'
        },
        parse: esprima.parse,
        comment: true
    };
    options.fileOutput = escodegen.generate(options.parsedFile, generateOptions);
    return callback(null, options);
}

function writeFile(options, callback) {
    fs.writeFile(options.filePath, options.fileOutput, {encoding: 'utf8'}, function (err, content) {
        options.fileContent = content;
        callback(err, options);
    });
}

//https://github.com/estools/escodegen/issues/239
function removeDuplicateComments(ast) {
    // Some comments are duplicated as both the leadingComment for one node,
    // and the trailing comment for another. Every comment's range is unique,
    // so two comments with the same range are talking about the same comment.
    // So we'll just remove all trailing comments which are also a leading
    // comment somewhere.
    const rangesInLeadingComments = new Set();
    estreeWalker.walk(ast, {
        enter: (node) => {
            for (let leadingComment of node.leadingComments || []) {
                rangesInLeadingComments.add(leadingComment.range.join(','));
            }
        }
    });
    estreeWalker.walk(ast, {
        enter: (node) => {
            if (!node.trailingComments) {
                return;
            }
            node.trailingComments = node.trailingComments.filter((comment) => {
                return !rangesInLeadingComments.has(comment.range.join(','));
            });
        }
    });
}