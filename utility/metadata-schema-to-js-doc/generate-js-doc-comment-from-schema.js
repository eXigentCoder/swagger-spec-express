'use strict';
var os = require('os');
var eol = os.EOL;
var _ = require('lodash');
var util = require('util');
let indentation = ' * ';

/** Generates a JsDoc comment based on the provided schema
 * @param {string} paramName the name of the parameter that the schema applies to
 * @param {object} schema The json schema to use to generate the comment
 * @return {string} The generated comment
 */
module.exports = function generateJsDocCommentFromSchema(paramName, schema) {
    let comment = '';
    let description = '@param {object} ' + paramName + ' ';
    if (schema.description) {
        comment += addComment(description + schema.description);
    } else {
        comment += addComment(description + 'todo');
    }
    comment += generateJsDocCommentForProperties(schema.properties, paramName + '.', schema.required);
    return comment;
};

function addComment(message, indentLevel) {
    if (!message) {
        throw new Error("Message cannot be blank");
    }
    var prefix = '';
    if (_.isNil(indentLevel)) {
        indentLevel = 1;
    }
    for (var i = 0; i < indentLevel; i++) {
        prefix += indentation;
    }
    return prefix + message + eol;
}

function generateJsDocCommentForProperties(properties, prefix, requiredFields) {
    let comment = '';
    prefix = prefix || '';
    requiredFields = requiredFields || [];
    Object.keys(properties).forEach(function (key) {
        comment += generateJsDocCommentForProperty(key, properties[key], requiredFields, prefix);
    });
    return comment;
}

function generateJsDocCommentForProperty(propertyName, property, requiredFields, prefix) {
    let comment = '';
    var description = property.description || 'todo-description';
    if (!property.type) {
        throw new Error("todo");
    }
    var type = property.type;
    if (type === 'array') {
        if (!property.items.type) {
            if (propertyName === 'parameters') {
                type = ['object', 'string'];
            } else {
                throw new Error("todo");
            }
        } else {
            type = property.items.type + '[]';
        }
    }
    if (_.isArray(type)) {
        type = type.join('|');
    }
    var optional = false;
    if (requiredFields.indexOf(propertyName) < 0) {
        optional = true;
    }
    var name = prefix + propertyName;
    var nameToPrint;
    if (optional) {
        nameToPrint = '[' + name + ']';
    } else {
        nameToPrint = name;
    }
    comment += addComment(util.format('@param {%s} %s - %s', type, nameToPrint, description));
    if (property.properties) {
        let newPrefix = name + '.';
        comment += generateJsDocCommentForProperties(property.properties, newPrefix, property.required);
    }
    return comment;
}
