'use strict';
var async = require('async');
let jsdox = require("jsdox");
var fs = require('fs');
var _ = require('lodash');

var outputDir = './docs/generated/';
async.waterfall([
    generateMDForSourceCode,
    loadGeneratedFileNames,
    loadGeneratedFileData,
    loadTemplate
], docsGenerated);

function docsGenerated(err) {
    if (err) {
        throw err;
    }
}

function generateMDForSourceCode(callback) {
    jsdox.generateForDir('./lib', outputDir, null, callback, null);
}

function loadGeneratedFileNames(callback) {
    fs.readdir(outputDir, null, function (err, fileNames) {
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
    fs.readFile(outputDir + fileName, {encoding: 'utf8'}, fileLoaded);
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
    fs.readFile('./utility/build-readme/template.md', null, function (err) {
        callback(err, data);
    });
}