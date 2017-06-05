'use strict';
var _ = require('lodash');

var schemasToGenerate = [
    {name: 'headerParameterSubSchema', parent: 'nonBodyParameter', extraSchemaInfo: require('./schemas/header-parameter-sub-schema.json')},
    {name: 'queryParameterSubSchema', parent: 'nonBodyParameter', extraSchemaInfo: require('./schemas/query-parameter-sub-schema.json')},
    {name: 'formDataParameterSubSchema', parent: 'nonBodyParameter', extraSchemaInfo: require('./schemas/form-data-parameter-sub-schema.json')},
    {name: 'pathParameterSubSchema', parent: 'nonBodyParameter', functions: [markNameAsRequired], extraSchemaInfo: require('./schemas/path-parameter-sub-schema.json')},
    {name: 'bodyParameter', functions: [addModels], extraSchemaInfo: require('./schemas/body-parameter.json')},
    {name: 'tag', extraSchemaInfo: require('./schemas/tag.json')},
    {name: 'schema', functions: [addNameProperty, addIdProperty, markNameAsRequired]},
    {name: 'response', functions: [addNameProperty, markNameAsRequired, addModels], extraSchemaInfo: require('./schemas/response.json')},
    {name: 'header', functions: [addNameProperty, markNameAsRequired], extraSchemaInfo: require('./schemas/header.json')},
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

function addIdProperty(schema){
    schema.properties = schema.properties || {};
    schema.properties.$id = {
        "type": "string",
        "format": "uri-reference"
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