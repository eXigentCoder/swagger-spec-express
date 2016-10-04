'use strict';
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var $RefParser = require('json-schema-ref-parser');
var generateJsDocCommentFromSchema = require('./generate-js-doc-comment-from-schema');
var os = require('os');
var esprima = require('esprima');
var escodegen = require('escodegen');
var estreeWalker = require('estree-walker');
var util = require("util");
var loadedDerefedSchemas = {};
//var eol = os.EOL;
/**
 * Takes a file path or an array of file paths and for each one will find and generate JsDoc comments based on a schema.
 * @param {string|string[]} files The files to parse and generate JsDocs based on
 * @param {function} callback The callback to call when done. Callback just has err param.
 * @return {void}
 */
module.exports = function injectSchema(files, callback) {
    if (_.isString(files)) {
        files = [files];
    }
    //use series to limit call stack size.
    async.eachSeries(files, injectSchemaForFile, callback);
};

function injectSchemaForFile(filePath, callback) {
    console.info('Processing file', filePath, '...');
    var options = {
        filePath: filePath,
        eol: '\n'
    };
    async.waterfall([
        async.apply(loadFile, options),
        parseFile,
        getCommentsToGenerate,
        generateOutput,
        writeFile
    ], callback);
}

function loadFile(options, callback) {
    console.info('\tLoading file ...');
    fs.readFile(options.filePath, {encoding: 'utf8'}, function (err, content) {
        if (err) {
            return callback(err);
        }
        console.info('\t\tDone.');
        options.fileContent = content;
        callback(null, options);
    });
}

function parseFile(options, callback) {
    console.info('\tParsing file ...');
    var parserOptions = {
        sourceType: 'module',
        comment: false,
        attachComment: true
    };
    options.parsedFile = esprima.parse(options.fileContent, parserOptions);
    console.info('\t\tDone.');
    console.info('\tRemoving duplicate comments ...');
    removeDuplicateComments(options.parsedFile);
    console.info('\t\tDone.');
    return callback(null, options);
}

function getCommentsToGenerate(options, callback) {
    options.commentsToGenerate = [];
    console.info('\tFinding comments to generate docs for ...');
    options.parsedFile.comments.forEach(function (comment) {
        if (comment.value.indexOf('@paramSchema') < 0) {
            return;
        }
        //don't use options.eol, this is generated from the parser.
        var lines = comment.value.split(os.EOL);
        lines.forEach(function (line) {
            if (line.indexOf('@paramSchema') < 0) {
                return;
            }
            var parts = line.trim().split(' ');
            if (parts.length !== 4) {
                throw new Error(util.format("Invalid @paramSchema format, should have had 4 parts after splitting on spaces but was %s. Line : %s. Full comment block %s", parts.length, line, comment));
            }
            options.commentsToGenerate.push({
                comment: comment,
                lines: lines,
                paramName: parts[2],
                schemaPath: parts[3],
                eol: options.eol
            });
        });
    });
    console.info('\t\tDone.');
    console.info('\tGenerating comments ...');
    async.eachSeries(options.commentsToGenerate, generateCommentFromOptions, function (err) {
        console.info('\tAll comments generated.');
        return callback(err, options);
    });
}

/**
 * Generates a comment based on input options
 * @param {object} options - Options to use to generate the comment.
 * @param {object} options.comment - The AST comment object.
 * @param {string} options.comment.type - The type of comment, string block etc.
 * @param {string} options.comment.value - The string comment value.
 * @param {string[]} options.line - The comment, split out into lines.
 * @param {string} options.paramName - The name of the parameter.
 * @param {string} options.schemaPath - The path to the schema file.
 * @param {number} options.insertAfterIndex - The index (line number) within the comment object where the comment should be inserted
 * @param {function} callback - A callback object with err param if something went wrong.
 * @returns {void}
 */
function generateCommentFromOptions(options, callback) {
    console.info('\t\tGenerating comments for', options.paramName, '...');
    async.waterfall([
        async.apply(loadSchema, options),
        derefSchema,
        generateComment,
        addGeneratedComment
    ], function (err) {
        if (err) {
            return callback(err);
        }
        console.info('\t\t\tDone.');
        return callback(null, options);
    });
}

function loadSchema(options, callback) {
    console.info('\t\t\tLoading schema ...');
    if (loadedDerefedSchemas[options.schemaPath]) {
        console.info('\t\t\t\tSchema was in cache.');
        options.schema = loadedDerefedSchemas[options.schemaPath];
        return process.nextTick(function () {
            callback(null, options);
        });
    }
    console.info('\t\t\t\tSchema not in cache, reading file ...');
    fs.readFile(options.schemaPath, {encoding: 'utf8'}, function (err, content) {
        if (err) {
            return callback(err);
        }
        console.info('\t\t\t\t\tDone.');
        console.info('\t\t\t\tparsing ...');
        try {
            options.schema = JSON.parse(content);
        }
        catch (parserError) {
            return callback(parserError);
        }
        console.info('\t\t\t\t\tDone.');
        return callback(null, options);
    });
}

function derefSchema(options, callback) {
    console.info('\t\t\tDerefing schema ...');
    if (loadedDerefedSchemas[options.schemaPath]) {
        console.info('\t\t\t\tSchema was in cache, skipping ...');
        return process.nextTick(function () {
            callback(null, options);
        });
    }
    $RefParser.dereference(options.schema, function (err, fullSchema) {
        if (err) {
            return callback(err);
        }
        console.info('\t\t\t\tDone.');
        options.schema = fullSchema;
        delete options.schema.definitions;
        loadedDerefedSchemas[options.schemaPath] = options.schema;
        return callback(null, options);
    });
}

function generateComment(options, callback) {
    console.info('\t\t\tGenerating comment ...');
    options.generatedComment = generateJsDocCommentFromSchema(options.paramName, options.schema, options.eol);
    console.info('\t\t\t\tDone.');
    return callback(null, options);
}

function addGeneratedComment(options, callback) {
    console.info('\t\t\tAdding generated comment ...');
    var generatedLines = options.generatedComment.split(options.eol);
    var searchString = util.format('* @paramSchema %s %s', options.paramName, options.schemaPath);
    var pramNameRegExString = '((' + options.paramName + '\\..+)|(' + options.paramName + '))';
    var paramNameWithOrWithoutBrackets = '((\\[' + pramNameRegExString + '\\])|(' + pramNameRegExString + '))';
    var regEx = new RegExp('^\\s*\\*\\s@param\\s((\\{.*\\}\\s' + paramNameWithOrWithoutBrackets + ')|' + paramNameWithOrWithoutBrackets + ')\\s.*\\(Generated\\)', 'i');
    _.remove(options.lines, function (line) {
        return regEx.test(line);
    });
    options.lines.forEach(function (line, index) {
        if (line.indexOf(searchString) < 0) {
            return;
        }
        var indentLevel = line.search(/\S/) - 1;
        if (indentLevel > 0) {
            var indent = '';
            for (let i = 0; i < indentLevel; i++) {
                indent += ' ';
            }
            generatedLines = generatedLines.map(function (generatedLine) {
                return indent + generatedLine;
            });
        }
        options.lines.splice.apply(options.lines, [index + 1, 0].concat(generatedLines));
    });
    options.comment.generatedComment = options.lines.join(options.eol);
    console.info('\t\t\t\tDone.');
    return callback(null, options);
}

function generateOutput(options, callback) {
    console.info('\t\tReplacing comments.');
    replaceComments(options.parsedFile);
    console.info('\t\t\tDone.');
    console.info('\t\tGenerating the output file.');
    var generateOptions = {
        format: {
            newline: options.eol, //doesn't seem like the escodegen lib honours this, so have a workaround
            indent: {
                adjustMultilineComment: true
            },
            quotes: 'single'
        },
        comment: true
    };
    options.fileOutput = escodegen.generate(options.parsedFile, generateOptions);
    if (options.eol !== os.EOL) {
        var regEx = new RegExp(options.eol, 'g');
        options.fileOutput = options.fileOutput.replace(regEx, os.EOL);
    }
    console.info('\t\t\tDone.');
    return callback(null, options);
}

function writeFile(options, callback) {
    console.info('\t\tWriting file to disk.');
    fs.writeFile(options.filePath, options.fileOutput, {encoding: 'utf8'}, function (err) {
        if (err) {
            return callback(err);
        }
        console.info('\t\t\tDone.');
        callback(null, options);
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

function replaceComments(rootDocument) {
    var rootComments = _.filter(rootDocument.comments, 'generatedComment');
    var leadingComments = _.filter(rootDocument.body, function (item) {
        if (!item.leadingComments) {
            return false;
        }
        var hasParamSchema = false;
        item.leadingComments.forEach(function (comment) {
            if (comment.value.indexOf('@paramSchema') >= 0) {
                hasParamSchema = true;
            }
        });
        return hasParamSchema;
    });

    leadingComments.forEach(function (leadingComment) {
        leadingComment.leadingComments.forEach(function (comment) {
            rootComments.forEach(function (rootComment) {
                if (comment.value === rootComment.value && rootComment.generatedComment) {
                    comment.value = rootComment.generatedComment;
                }
            });
        });
    });
}