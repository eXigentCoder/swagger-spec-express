'use strict';
var _ = require('lodash');
var fullSchema = require('swagger-schema-official/schema.json');
var schemasToGenerate = [
    {name: 'headerParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'queryParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'formDataParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'pathParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'bodyParameter'},
    {name: 'tag'},
    {name: 'definitions'},
    {name: 'response'}
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
    var filename = schemaToGenerate.id + ".json";
    fs.writeFile('./lib/schemas/' + filename, JSON.stringify(schemaToGenerate, null, 4), null, callback);
}


function resolveDefinitions(schema, rootDefinitions) {
    if (schema.properties) {
        Object.keys(schema.properties).forEach(async.apply(checkPropertyForLinkedSchemas, schema, rootDefinitions));
    }
    if (schema.additionalProperties && _.isObject(schema.additionalProperties)) {
        Object.keys(schema.additionalProperties).forEach(async.apply(processAdditionalProperty, schema, rootDefinitions));
    }
    if (schema.patternProperties && _.isObject(schema.patternProperties)) {
        Object.keys(schema.patternProperties).forEach(async.apply(processPatternProperties, schema, rootDefinitions));
    }
}

function checkPropertyForLinkedSchemas(schema, rootDefinitions, propertyName) {
    var property = schema.properties[propertyName];
    if (property.type === 'object') {
        return resolveDefinitions(property, rootDefinitions);
    }
    var $ref = property.$ref;
    if (!$ref) {
        return;
    }
    if (_.startsWith($ref, "http")) {
        rootDefinitions[propertyName] = {
            "$ref": $ref
        };
        return;
    }
    add$refToDefinition($ref, rootDefinitions);
}

function add$refToDefinition($ref, rootDefinitions) {
    var searchString = "#/definitions/";
    if (!_.startsWith($ref, searchString)) {
        throw new Error("Unknown $ref format " + $ref);
    }
    var definitionName = $ref.toString().substring(searchString.length, $ref.length);
    var definition = fullSchema.definitions[definitionName];
    if (!definition) {
        throw new Error("Unable to find $ref " + $ref + " in the full schema");
    }
    rootDefinitions[definitionName] = definition;
}

function processAdditionalProperty(schema, rootDefinitions, propertyName) {
    var property = schema.additionalProperties[propertyName];
    if (propertyName === '$ref') {
        if (_.startsWith(property, "http")) {
            return;
        }
        return add$refToDefinition(property, rootDefinitions);
    }
    throw new Error("not implemented");
}

function processPatternProperties(schema, rootDefinitions, propertyName) {
    var property = schema.patternProperties[propertyName];
    var $ref = property.$ref;
    if (!$ref) {
        throw new Error("not implemented");
    }
    if (_.startsWith($ref, "http")) {
        return;
    }
    add$refToDefinition($ref, rootDefinitions);
}