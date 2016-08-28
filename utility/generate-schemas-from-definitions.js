'use strict';
var _ = require('lodash');
var fullSchema = require('swagger-schema-official/schema.json');
var schemasToGenerate = [
    {name: 'headerParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'queryParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'formDataParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'pathParameterSubSchema', parent: 'nonBodyParameter', functions: [markNameAsRequired]},
    {name: 'bodyParameter'},
    {name: 'tag'},
    {name: 'definitions', functions: [addNameProperty, markNameAsRequired]},
    {name: 'response', functions: [addNameProperty, markNameAsRequired]}
];
var async = require('async');
var fs = require('fs');

async.each(schemasToGenerate, getSchemaForDefinition, function (err) {
    if (err) {
        throw err;
    }
});

function getSchemaForDefinition(schemaData, callback) {
    var definitionName = schemaData.name;
    var schemaToGenerate = {
        $schema: "http://json-schema.org/draft-04/schema#",
        id: _.kebabCase(definitionName),
        title: _.capitalize(_.kebabCase(definitionName).split('-').join(' '))
    };
    if (schemaData.parent) {
        var parentSchema = fullSchema.definitions[schemaData.parent];
        if (!parentSchema) {
            throw new Error('Parent schema not found ' + schemaData.parent);
        }
        parentSchema = _.cloneDeep(parentSchema);
        delete parentSchema.oneOf;
        _.merge(schemaToGenerate, parentSchema, fullSchema.definitions[definitionName]);
    } else {
        _.merge(schemaToGenerate, fullSchema.definitions[definitionName]);
    }
    if (!schemaToGenerate) {
        throw new Error("No definition found with the name " + definitionName);
    }
    schemaToGenerate.definitions = {};
    resolveDefinitions(schemaToGenerate, schemaToGenerate.definitions);
    if (schemaData.functions) {
        schemaData.functions.forEach(function (fn) {
            fn(schemaToGenerate);
        });
    }
    var filename = schemaToGenerate.id + ".json";
    fs.writeFile('./lib/schemas/' + filename, JSON.stringify(schemaToGenerate, null, 4), null, callback);
}


function resolveDefinitions(schema, rootDefinitions) {
    var definitionNames = getDefinitionsNamesFromSchema(schema);
    definitionNames.forEach(function (definitionName) {
        if (rootDefinitions[definitionName]) {
            return;
        }
        rootDefinitions[definitionName] = fullSchema.definitions[definitionName];
        resolveDefinitions(rootDefinitions[definitionName], rootDefinitions);
    });
}

function getDefinitionsNamesFromSchema(schema) {
    var results = [];
    var schemaString = JSON.stringify(schema, null, 4);
    var searchString = '$ref": "#/definitions/';
    var words = schemaString.split(searchString);
    words.forEach(getDefinitionName);
    function getDefinitionName(word) {
        var endIndex = word.indexOf('"');
        var name = word.substr(0, endIndex);
        if (name && !_.startsWith(name, '{')) {
            var definition = fullSchema.definitions[name];
            if (!definition) {
                throw new Error("Unable to find definition with name " + name + " in the full schema");
            }
            results.push(name);
        }
    }

    return results;
}
function addNameProperty(schema) {
    schema.properties = schema.properties || {};
    schema.properties.name = {
        "type": "string"
    };
}

function markNameAsRequired(schema) {
    schema.required = schema.required || [];
    schema.required.push('name');
}