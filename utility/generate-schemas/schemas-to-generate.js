'use strict';
var _ = require('lodash');

var schemasToGenerate = [
    {name: 'headerParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'queryParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'formDataParameterSubSchema', parent: 'nonBodyParameter'},
    {name: 'pathParameterSubSchema', parent: 'nonBodyParameter', functions: [markNameAsRequired]},
    {name: 'bodyParameter', functions: [addModels]},
    {name: 'tag', extraSchemaInfo: require('./tag.json')},
    {name: 'schema', functions: [addNameProperty, markNameAsRequired]},
    {name: 'response', functions: [addNameProperty, markNameAsRequired, addModels]},
    {name: 'header', functions: [addNameProperty, markNameAsRequired]},
    {name: 'operation'}
];

module.exports = {
    schemaNames: _.map(schemasToGenerate, 'name'),
    nameRequiredForCommon: ['schema', 'response', 'header'],
    schemasToGenerate: schemasToGenerate
};

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