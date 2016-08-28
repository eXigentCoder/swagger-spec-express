# swagger-spec-express
![alt text](https://api.travis-ci.org/eXigentCoder/swagger-spec-express.svg "Build Status")

A library that allows you to programmatically annotate your existing express api with [swagger](http://swagger.io/) info and then generate and validate your json spec file. All without completely starting over or changing the structure of your express routes.

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

## API Options

###Initialise & initialize
Both British and American spelling supported.

> initialise(app, options)
> initialize(app, options)

Will initialise your app with the required swaggers-spec information. In addition you can pass in some options which will be used when generating the swagger JSON document later on.

####Parameters

Name | Type | Description
--- | --- | ---
app | object | Your express app object to be swaggerized.
options | object | The swagger spec options to be used when generating the swagger.json file. See the options properties below.

####Options properties
Name | Type | Description
--- | --- | ---
document | object | An existing or manually created swagger document to use as a base document and expanded upon. Note that the following options will override the base items in this supplied document
title|string|The title of the application.
description|string|A short description of the application. [GFM syntax](A short description of the application. GFM syntax can be used for rich text representation.) can be used for rich text representation.
termsOfService|string|The Terms of Service for the API.
contact|[object](http://swagger.io/specification/#contactObject)|The contact information for the exposed API.
license|[object](http://swagger.io/specification/#licenseObject)|The license information for the exposed API.
version|string|Provides the version of the application API.
host|string|The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the host is not included, the host serving the documentation is to be used (including the port). The host does not support [path templating](http://swagger.io/specification/#pathTemplating).
basePath|string|The base path on which the API is served, which is relative to the host. If it is not included, the API is served directly under the host. The value MUST start with a leading slash (/). The basePath does not support [path templating](http://swagger.io/specification/#pathTemplating). Default '/'
schemes|array|The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
consumes|\[string\]|A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](http://swagger.io/specification/#mimeTypes).
produces|\[string\]|A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](http://swagger.io/specification/#mimeTypes).
paths|[object](swagger.io/specification/#pathsObject)|The available paths and operations for the API.
definitions|[object](http://swagger.io/specification/#definitionsObject)|An object to hold data types produced and consumed by operations.
parameters| [object](http://swagger.io/specification/#parametersDefinitionsObject) |An object to hold parameters that can be used across operations. This property does not define global parameters for all operations.
responses| [object](http://swagger.io/specification/#responsesDefinitionsObject) |An object to hold responses that can be used across operations. This property does not define global responses for all operations.
securityDefinitions| [object](http://swagger.io/specification/#securityDefinitionsObject) |Security scheme definitions that can be used across the specification.
security|\[ [object](http://swagger.io/specification/#securityRequirementObject) \]|A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition.
defaultSecurity | string\|array\| [object](http://swagger.io/specification/#securityRequirementObject) | The default security schema to use on a route when the security parameter is set to **true**
tags|\[ [object](http://swagger.io/specification/#tagObject) \]|A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](swagger.io/specification/#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
externalDocs| [object](http://swagger.io/specification/#externalDocumentationObject) |Additional external documentation.



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