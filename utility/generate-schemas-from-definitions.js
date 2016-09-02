'use strict';
//var request = require('request');
// var Ajv = require('ajv');
// var ajv = new Ajv({
//     removeAdditional: "failing",
//     useDefaults: true,
//     coerceTypes: true,
//     allErrors: true,
//     verbose: true,
//     format: "full"
// });
//var $RefParser = require('json-schema-ref-parser');
var _ = require('lodash');
var jsonSchemaSchema = require('../lib/schemas/json-schema-4.0.json');
var fullSchema = require('swagger-schema-official/schema.json');
var async = require('async');
var fs = require('fs');
var baseUrl = 'http://json-schema.org/draft-04/schema#/';
var propertiesSearchString = baseUrl + 'properties/';
var definitionsSearchString = baseUrl + 'definitions/';
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
    replaceHttpReferences,
    writeMainSchemaToFile,
    //resolveRefs,
    generateSchemas,
    writeMetaDataFile
], waterfallComplete);

function waterfallComplete(err) {
    if (err) {
        throw err;
    }
}


function replaceHttpReferences(callback) {
    localise(fullSchema, fullSchema);
    callback();
}
function writeMainSchemaToFile(callback) {
    fs.writeFile('./lib/schemas/base.json', JSON.stringify(fullSchema, null, 4), null, callback);
}

function localise(currentSchemaItem, fullSchema, parent) {
    if (_.isString(currentSchemaItem)) {
        return;
    }
    Object.keys(currentSchemaItem).forEach(function (key) {
        var value = currentSchemaItem[key];
        if (_.isArray(value)) {
            value.forEach(function (item) {
                localise(item, fullSchema, key);
            });
            return;
        }
        if (_.isObject(value)) {
            localise(value, fullSchema, key);
            return;
        }
        if (key !== '$ref') {
            return;
        }
        var propertiesIndex = value.indexOf(propertiesSearchString);
        var definitionsIndex = value.indexOf(definitionsSearchString);
        if (propertiesIndex < 0 && definitionsIndex < 0) {
            return;
        }
        if (propertiesIndex > 0 && definitionsIndex > 0) {
            throw new Error("Both search strings found items, unhandled");
        }
        if (!parent) {
            throw new Error("not implemented");
        }
        var name;
        if (propertiesIndex >= 0) {
            name = getNameFrom$refString(value, propertiesSearchString);
            var property = getJsonSchemaProperty(name);
            delete currentSchemaItem.$ref;
            Object.keys(property).forEach(function (propKey) {
                currentSchemaItem[propKey] = property[propKey];
            });
            return;
        }
        name = getNameFrom$refString(value, definitionsSearchString);
        var definition = getJsonSchemaDefiniton(name);
        if (fullSchema.definitions[name]) {
            console.warn('already has definition ' + name + ", overwriting");
        }
        fullSchema.definitions[name] = definition;
        currentSchemaItem[key] = '#/definitions/' + name;
    });
}

function getNameFrom$refString(value, prefix) {
    return value.replace(prefix, '');
}

function getJsonSchemaProperty(name) {
    var property = jsonSchemaSchema.properties[name];
    if (!property) {
        throw new Error("Json Schema 4.0 didn't have property " + name);
    }
    return property;
}

function getJsonSchemaDefiniton(name) {
    var definition = jsonSchemaSchema.definitions[name];
    if (!definition) {
        throw new Error("Json Schema 4.0 didn't have definition " + name);
    }
    return definition;
}

// function resolveRefs(callback) {
//     $RefParser.bundle(fullSchema, function (err, bundled) {
//         if (err) {
//             return callback(err);
//         }
//         fullSchema = bundled;
//         return callback();
//     });
// }

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