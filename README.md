# swagger-spec-express
![alt text](https://api.travis-ci.org/eXigentCoder/swagger-spec-express.svg "Build Status")

A library that allows you to programmatically annotate your existing express api with [swagger](http://swagger.io/) info and then generate and validate your json spec file. All without completely starting over or changing the structure of your express routes.

## Why
There are already a few libraries out there to add swagger documentation to your [express](https://expressjs.com/) api, like [swagger-node-express](https://www.npmjs.com/package/swagger-node-express) and [swagger-node](https://github.com/swagger-api/swagger-node) which work really well, however they require you to either start from scratch or change your routes to work with their format. This libary is different and can easily be added to an existing and established express api using the normal patterns you are used to.

##Installation

Install the package:
> npm install swagger-spec-express --save-exact

Basic code example:

    var express = require('express');
    var swagger = require('swagger-spec-express');
    var packageJson = require('./package.json');

    var app = express();
    app.get('/swagger.json', function (err, res) {
        res.status(200).json(swagger.json());
    });
    var options = {
        title: packageJson.title,
        version: packageJson.version
    };
    swagger.initialise(app, options, swaggerInitialised);

    function swaggerInitialised(err) {
        if (err) {
            throw err;
        }
        swagger.compile();
        var port = 3000;
        app.listen(port, appListening);
        function appListening() {
            console.info(packageJson.name + ' is listening on port ' + port);
        }
    }
This will create a very basic express app that serves up the swagger.json document when you navigate to **/swagger.json**
See the api section below for the available options.
## Describing Your Routes
### using the app object

### using the route object

## More Complex Setup

## API Options

## Roadmap
### Low
- Currently populating rootDocument.responses but then injecting the responses directly into the operation. Should use the $ref
- Currently populating rootDocument.parameters but then injecting the responses directly into the operation. Should use the $ref
- Validation of the add common item methods
- Validation of the metadata add
### Medium
- Ability to describe the app like a router (alternate to passing all the data into the init method).
- Ability to manually specify routes.
- Update document with how to use the library when closer to a definied standard.
- More tests
### High
- addResponse should look for model & arrayOfModel
- Better error messages in general so you don't need to debug
- Ability to inject certain things into parameters. E.g. many GET routes will have GET /thing/:identifier would be nice to inject the name in there
- if I call addModel with an explicit name and there is a name in the doc, the name in the doc overwrites the specified name
- if metadata is a function, throw error.
- might be possible to set "lastRouter" in the state and then attach the route there, to prevent the need to pass in the router each time.

- don't take in a name with the common items, just the schema. validate those against the item the actually are on the json schema file, ensure name is there