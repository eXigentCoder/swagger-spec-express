'use strict';
var _ = require('lodash');
var fullSchema = require('swagger-schema-official/schema.json');
var async = require('async');
var fs = require('fs');
var schemasToGenerate = [
    {name: 'headerParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'queryParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'formDataParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'pathParameterSubSchema', parent: 'nonBodyParameter', functions: [markNameAsRequired]},
    {name: 'bodyParameter', functions: [addModels]},
    {name: 'tag'},
    {name: 'schema', functions: [addNameProperty, markNameAsRequired]},
    {name: 'response', functions: [addNameProperty, markNameAsRequired]},
    {name: 'header', functions: [addNameProperty, markNameAsRequired]},
    {name: 'operation'}
];
var schemaNames = _.map(schemasToGenerate, 'name');
var nameRequiredForCommon = ['schema', 'response', 'header'];
async.waterfall([
    generateSchemas,
    writeMetaDataFile
], waterfallComplete);

function waterfallComplete(err) {
    if (err) {
        throw err;
    }
}

function generateSchemas(callback) {
    async.each(schemasToGenerate, getSchemaForDefinition, callback);
}

function writeMetaDataFile(callback) {
    var operationSchema = require('../lib/schemas/operation.json');
    Object.keys(operationSchema.definitions).forEach(function (definitionName) {
        if (schemaNames.indexOf(definitionName) < 0) {
            return;
        }
        var customisedSchema = _.cloneDeep(require('../lib/schemas/' + _.kebabCase(definitionName).toLowerCase() + '.json'));
        delete customisedSchema.definitions;
        delete customisedSchema.$schema;
        delete customisedSchema.id;
        if (nameRequiredForCommon.indexOf(definitionName) >= 0) {
            delete customisedSchema.properties.name;
            if (customisedSchema.required) {
                _.remove(customisedSchema.required, function (propertyName) {
                    return propertyName === 'name';
                });
                if (customisedSchema.required.length === 0) {
                    delete customisedSchema.required;
                }
            }
        }
        operationSchema.definitions[definitionName] = customisedSchema;
    });
    var operationExtraDataSchema = require('../lib/schemas/operation-extra-data.json');
    var schema = _.merge({}, operationSchema, operationExtraDataSchema);
    schema.id = 'metadata';
    fs.writeFile('./lib/schemas/meta-data.json', JSON.stringify(schema, null, 4), null, callback);
}

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

function addModels(schema) {
    schema.properties = schema.properties || {};
    schema.properties.model = {
        "type": "string",
        "description": "The name of the model produced or consumed."
    };
    schema.properties.arrayOfModel = {
        "type": "string",
        "description": "The name of the model produced or consumed as an array."
    };
    schema.required = schema.required || [];
    var schemaIndex = schema.required.indexOf('schema');
    if (schemaIndex < 0) {
        return;
    }
    var oldRequired = schema.required;
    oldRequired.splice(schemaIndex, 1);
    delete schema.required;
    schema.allOf = schema.allOf || [];
    schema.allOf.push({required: oldRequired});
    schema.allOf.push({
        anyOf: [
            {required: ['schema']},
            {required: ['model']},
            {required: ['arrayOfModel']}
        ]
    });
}