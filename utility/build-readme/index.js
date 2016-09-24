'use strict';
var async = require('async');
let jsdox = require("jsdox");
var fs = require('fs');
var _ = require('lodash');
var generatedSourceDocsOutputDir = './docs/generated/';
var outputDir = './README.md';
async.waterfall([
    generateMDForSourceCode,
    loadGeneratedFileNames,
    loadGeneratedFileData,
    loadTemplate,
    injectDocuments,
    writeFile
], docsGenerated);

function docsGenerated(err) {
    if (err) {
        throw err;
    }
}

function generateMDForSourceCode(callback) {
    jsdox.generateForDir('./lib', generatedSourceDocsOutputDir, './utility/build-readme/templates/', callback, null);
}

function loadGeneratedFileNames(callback) {
    fs.readdir(generatedSourceDocsOutputDir, null, function (err, fileNames) {
        var data = {
            fileNames: fileNames
        };
        return callback(err, data);
    });
}

function loadGeneratedFileData(data, callback) {
    data.sources = [];
    async.each(data.fileNames, async.apply(loadFileData, data), filesLoaded);
    function filesLoaded(err) {
        delete data.fileNames;
        return callback(err, data);
    }
}

function loadFileData(data, fileName, callback) {
    fs.readFile(generatedSourceDocsOutputDir + fileName, {encoding: 'utf8'}, fileLoaded);
    function fileLoaded(err, content) {
        if (err) {
            return callback(err);
        }
        content = content.trim();
        if (content !== '* * *') {
            fileName = fileName.replace(/\.md$/i, '');
            fileName = _.startCase(fileName);
            data.sources.push({name: fileName, content: content});
        }
        return callback(null, data);
    }
}

function loadTemplate(data, callback) {
    fs.readFile('./utility/build-readme/template.md', {encoding: 'utf8'}, function (err, content) {
        data.template = content;
        callback(err, data);
    });
}

function injectDocuments(data, callback) {
    var mergedSource = '';
    data.sources.forEach(function (src) {
        mergedSource += src.content;
    });
    data.output = data.template.replace('{{sourceDocs}}', mergedSource);
    return callback(null, data);
}

function writeFile(data, callback) {
    fs.writeFile(outputDir, data.output, {encoding: 'utf8'}, callback);
}