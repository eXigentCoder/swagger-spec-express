'use strict';
module.exports = {
    body: body,
    formDataParameter: formDataParameter,
    headerParameter: headerParameter,
    pathParameter: pathParameter,
    queryParameter: queryParameter,
    model: model,
    response: response,
    tag: tag,
    header: header
};

function body() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "body",
        required: true,
        schema: {},
        "x-potato": "space"
    };
}

function formDataParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "formData",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function headerParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "header",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function pathParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "path",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function queryParameter() {
    return {
        name: "testTag",
        description: "A test tag",
        in: "query",
        type: "string",
        required: true,
        "x-potato": "space"
    };
}

function model() {
    return {
        name: "testTag",
        description: "A test tag",
        type: 'object',
        properties: {},
        "x-potato": "space"
    };
}

function response() {
    return {
        name: "testTag",
        description: "A test tag",
        schema: {},
        "x-potato": "space"
    };
}

function tag() {
    return {
        name: "testTag",
        description: "A test tag",
        externalDocs: {
            description: "Google",
            url: "https://www.google.co.za"
        },
        "x-potato": "space"
    };
}

function header() {
    return {
        name: "testTag",
        description: "A test tag",
        type: "string",
        "x-potato": "space"
    };
}