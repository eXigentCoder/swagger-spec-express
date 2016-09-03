'use strict';
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var schemaIds = require('../lib/schema-ids');

module.exports = function getSchemaForDefinition(data, schemaRules, callback) {
    var definitionName = schemaRules.name;
    var fileName = _.kebabCase(definitionName) + ".json";
    var schemaToGenerate = {
        $schema: "http://json-schema.org/draft-04/schema#",
        id: schemaIds.prefix + fileName,
        title: _.capitalize(_.kebabCase(definitionName).split('-').join(' '))
    };
    if (schemaRules.parent) {
        var parentSchema = data.baseSchema.definitions[schemaRules.parent];
        if (!parentSchema) {
            throw new Error('Parent schema not found ' + schemaRules.parent);
        }
        parentSchema = _.cloneDeep(parentSchema);
        delete parentSchema.oneOf;
        _.merge(schemaToGenerate, parentSchema, data.baseSchema.definitions[definitionName]);
    } else {
        _.merge(schemaToGenerate, data.baseSchema.definitions[definitionName]);
    }
    if (!schemaToGenerate) {
        throw new Error("No definition found with the name " + definitionName);
    }
    schemaToGenerate.definitions = {};
    resolveDefinitions(data, schemaToGenerate, schemaToGenerate.definitions);
    if (schemaRules.functions) {
        schemaRules.functions.forEach(function (fn) {
            fn(schemaToGenerate);
        });
    }
    fs.writeFile('./lib/schemas/' + fileName, JSON.stringify(schemaToGenerate, null, 4), null, callback);
};

function resolveDefinitions(data, schema, rootDefinitions) {
    var definitionNames = getDefinitionsNamesFromSchema(data, schema);
    definitionNames.forEach(function (definitionName) {
        if (rootDefinitions[definitionName]) {
            return;
        }
        rootDefinitions[definitionName] = data.baseSchema.definitions[definitionName];
        resolveDefinitions(data, rootDefinitions[definitionName], rootDefinitions);
    });
}

function getDefinitionsNamesFromSchema(data, schema) {
    var results = [];
    var schemaString = JSON.stringify(schema, null, 4);
    var searchString = '$ref": "#/definitions/';
    var words = schemaString.split(searchString);
    words.forEach(async.apply(getDefinitionName, data, results));
    return results;
}

function getDefinitionName(data, results, word) {
    var endIndex = word.indexOf('"');
    var name = word.substr(0, endIndex);
    if (name && !_.startsWith(name, '{')) {
        var definition = data.baseSchema.definitions[name];
        if (!definition) {
            throw new Error("Unable to find definition with name " + name + " in the full schema");
        }
        results.push(name);
    }
}