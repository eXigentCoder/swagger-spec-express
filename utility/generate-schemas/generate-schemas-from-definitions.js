'use strict';
var async = require('async');
var fs = require('fs');
var removeRemoteUrlsFromSchema = require('./remove-remote-urls-from-schema');
var schemas = require('./schemas-to-generate');
var writeMetaDataFile = require('./write-meta-data');
var getSchemaForDefinition = require('./get-schema-for-definition');

async.waterfall([
    removeRemoteUrlsFromSchema,
    writeMainSchemaToFile,
    generateSchemas,
    writeMetaDataFile
], waterfallComplete);

function waterfallComplete(err) {
    if (err) {
        throw err;
    }
}

function writeMainSchemaToFile(data, callback) {
    fs.writeFile('./lib/schemas/base.json', JSON.stringify(data.baseSchema, null, 4), null, fileWritten);
    function fileWritten(err) {
        return callback(err, data);
    }
}

function generateSchemas(data, callback) {
    async.each(schemas.schemasToGenerate, async.apply(getSchemaForDefinition, data), allSchemasGenerated);
    function allSchemasGenerated(err) {
        return callback(err, data);
    }
}

