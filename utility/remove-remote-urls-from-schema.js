'use strict';
var jsonSchemaSchema = require('../lib/schemas/json-schema-4.0.json');
var fullSchema = require('swagger-schema-official/schema.json');
var _ = require('lodash');
var async = require('async');
var baseUrl = 'http://json-schema.org/draft-04/schema#/';
var propertiesSearchString = baseUrl + 'properties/';
var definitionsSearchString = baseUrl + 'definitions/';

module.exports = function replaceHttpReferences(callback) {
    var schema = _.cloneDeep(fullSchema);
    try {
        localise(schema);
        copyDefinitions(schema);
    }
    catch (err) {
        return callback(err);
    }
    callback(null, {baseSchema: schema});
};


function localise(schema, root) {
    root = root || schema;
    if (!_.isObject(schema)) {
        return;
    }
    Object.keys(schema).forEach(async.apply(localiseSchemaProperty, schema, root));
}

function localiseSchemaProperty(parent, root, propertyName) {
    var property = parent[propertyName];
    if (_.isArray(property)) {
        property.forEach(function (item) {
            localise(item, root);
        });
        return;
    }
    if (_.isObject(property)) {
        localise(property, root);
        return;
    }
    if (propertyName !== '$ref') {
        return;
    }
    localise$ref(property, parent, root, propertyName);
}


function localise$ref(property, parent, root, propertyName) {
    var propertiesIndex = property.indexOf(propertiesSearchString);
    var definitionsIndex = property.indexOf(definitionsSearchString);
    if (propertiesIndex < 0 && definitionsIndex < 0) {
        return;
    }
    if (propertiesIndex > 0 && definitionsIndex > 0) {
        throw new Error("Both search strings found items, unhandled");
    }
    if (propertiesIndex >= 0) {
        return setProperty(property, parent);
    }
    setDefinition(property, root, parent, propertyName);
}

function setProperty(property, parent) {
    var name = getNameFrom$refString(property, propertiesSearchString);
    var propertyFromJsonSchema = getJsonSchemaProperty(name);
    delete parent.$ref;
    Object.keys(propertyFromJsonSchema).forEach(function (propKey) {
        parent[propKey] = propertyFromJsonSchema[propKey];
    });
}

function setDefinition(property, root, parent, propertyName) {
    var name = getNameFrom$refString(property, definitionsSearchString);
    var definitionFromJsonSchema = getJsonSchemaDefinition(name);
    if (root.definitions[name]) {
        if (_.isMatch(root.definitions[name], definitionFromJsonSchema)) {
            return;
        }
        throw new Error('Already has property ' + name + ' which is not a match');
    }
    root.definitions[name] = definitionFromJsonSchema;
    parent[propertyName] = '#/definitions/' + name;
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

function getJsonSchemaDefinition(name) {
    var definition = jsonSchemaSchema.definitions[name];
    if (!definition) {
        throw new Error("Json Schema 4.0 didn't have definition " + name);
    }
    return definition;
}

function copyDefinitions(schema) {
    Object.keys(jsonSchemaSchema.definitions).forEach(function (definitionName) {
        if (schema.definitions[definitionName]) {
            if (_.isMatch(schema.definitions[definitionName], jsonSchemaSchema.definitions[definitionName])) {
                return;
            }
            throw new Error('Already has definition for ' + definitionName + ' which is not a match');
        }
        schema.definitions[definitionName] = jsonSchemaSchema.definitions[definitionName];
    });
}