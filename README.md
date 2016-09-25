# swagger-spec-express

> Programmatically generate your Swagger specification (JSON) file.

[![NPM][spe-npm-icon] ][spe-npm-url]

[![Build status][spe-ci-image] ][spe-ci-url]

A library that allows you to programmatically annotate your existing express api with [swagger](http://swagger.io/) info and then generate and validate your json spec file. All without completely starting over or changing the structure of your express routes. Please note that this document is still being written.

## Why
There are already a few libraries out there to add Swagger documentation to your [express](https://expressjs.com/) api, like [swagger-node-express](https://www.npmjs.com/package/swagger-node-express) and [swagger-node](https://github.com/swagger-api/swagger-node) which work really well, however they require you to either start from scratch or change your routes to work with their format. This libary is different and can easily be added to an existing and established express api using the normal patterns you are used to.

##Installation
Requires Express 4.x

Install the package:
> npm install swagger-spec-express --save-exact

Basic code example:

```javascript
var express = require('express');
var swagger = require('swagger-spec-express');
var packageJson = require('./package.json');

var app = express();
var options = {
    title: packageJson.title,
    version: packageJson.version
};
swagger.initialise(app, options);

app.get('/swagger.json', function (err, res) {
    res.status(200).json(swagger.json());
}).describe({
    responses: {
        200: {
            description: "Returns the swagger.json document"
        }
    }
});

swagger.compile();
var port = 3000;
app.listen(port, appListening);
function appListening() {
    console.info(packageJson.name + ' is listening on port ' + port);
}
```

This will create a very basic express app that serves up the swagger.json document when you navigate to **http://localhost:3000/swagger.json**

The [JSON Schema](http://json-schema.org/) file that will be used to validate the supplied
metadata on the route can be found [here](https://raw.githubusercontent.com/eXigentCoder/swagger-spec-express/master/lib/schemas/meta-data.json) in addition the fields are detailed below. Wherever possible the library tries to adhear to the official [Swagger Specification](http://swagger.io/specification/) so that is a good place to look for extra information about what you can specify.

## Describing Your Routes
As seen above, once you have called initialise on your app, the describe method is automatically added and can be added to routes you declare directly on your app object.

But what if you want to use the router object? In the above example code above add the following to the top of the page:

```javascript
var exampleRouter = require('./example-route');
```

And then after calling **swagger.initialise(app, options);** add the following:

```javascript
app.use(exampleRouter);
```

Code for the example router:

```javascript
'use strict';
var express = require('express');
var swagger = require('swagger-spec-express');
var router = new express.Router();
swagger.swaggerize(router);
module.exports = router;

router.get('/one', function (req, res) {
    res.status(200).json({example: 1})
}).describe({
    responses: {
        200: {
            description: "Returns example 1"
        }
    }
});
```


## Adding the UI
_todo_

## API

## Reporting Bugs & Issues
_todo_

## Integrating to your tests
_todo_

## Awesome code reuse
_todo_

## Roadmap
### Low
- Currently populating rootDocument.responses but then injecting the responses directly into the operation. Should use the $ref
- Currently populating rootDocument.parameters but then injecting the responses directly into the operation. Should use the $ref
### Medium
- Ability to describe the app like a router (alternate to passing all the data into the init method).
- Ability to manually specify routes.
- More tests
### High
- addResponse should look for model & arrayOfModel
- Better error messages in general so you don't need to debug
- Ability to inject certain things into parameters. E.g. many GET routes will have GET /thing/:identifier would be nice to inject the name in there
- Add examples to this document
- when using arrayOfModel the schema doesn't have an id, so makes it harder to use ajv. Currently we just wrapping in {items:}. Still an issue?
- custom fields not on all schemas?

[spe-npm-icon]: https://nodei.co/npm/swagger-spec-express.svg
[spe-npm-url]: https://npmjs.org/package/swagger-spec-express
[spe-ci-image]: https://travis-ci.org/eXigentCoder/swagger-spec-express.svg?branch=master
[spe-ci-url]: https://travis-ci.org/eXigentCoder/swagger-spec-express