'use strict';
var os = require('os');
var eol = os.EOL;
var _ = require('lodash');
var util = require('util');

module.exports = function generateComment(options, callback) {
    options.comment = '';
    options.indentation = options.indentation || ' * ';
    add('/**', 0);
    if (options.schema.description) {
        add(options.schema.description);
    }
    addProperties(options.schema.properties, null, options.schema.required);
    add(' */', 0);
    return callback(null, options);

    function add(message, indentLevel) {
        addComment(options, message, indentLevel);
    }

    function addProperties(properties, prefix, required) {
        prefix = prefix || '';
        required = required || [];
        Object.keys(properties).forEach(function (key) {
            var value = properties[key];
            var description = value.description || 'todo-description';
            var type = value.type || 'todo-type';
            if (type === 'array') {
                if (!value.items.type) {
                    if (key === 'parameters') {
                        type = ['object', 'string']
                    } else {
                        throw new Error("todo");
                    }
                } else {
                    type = value.items.type + '[]';
                }
            }
            if (_.isArray(type)) {
                type = type.join('|');
            }
            var optional = false;
            if (required.indexOf(key) < 0) {
                optional = true;
            }
            var name = prefix + key;
            var nameToPrint;
            if (optional) {
                nameToPrint = '[' + name + ']';
            } else {
                nameToPrint = name;
            }
            add(util.format('@param {%s} %s %s', type, nameToPrint, description));
            if (value.properties) {
                addProperties(value.properties, name + '.', value.required);
            }
        });
    }
};

function addComment(options, message, indentLevel) {
    if (!message) {
        throw new Error("Message cannot be blank");
    }
    var prefix = '';
    if (_.isNil(indentLevel)) {
        indentLevel = 1;
    }
    for (var i = 0; i < indentLevel; i++) {
        prefix += options.indentation;
    }
    options.comment += prefix + message + eol;
}