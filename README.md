# swagger-spec-express
![alt text](https://api.travis-ci.org/eXigentCoder/swagger-spec-express.svg "Build Status")
Allows you to programmatically annotate your express routes with swagger info and then generate and validate your json spec file

##NB##
Please note that this module is still heavily under development, more information to come.

##ToDo##
### Low ###
- Currently populating rootDocument.responses but then injecting the responses directly into the operation. Should use the $ref
- Currently populating rootDocument.parameters but then injecting the responses directly into the operation. Should use the $ref
- Validation of the add common item methods to ensure only the correct properties are added will be okay if we validate the full doc and spit out the errors, check after
- Validation of the metadata add will be okay if we validate the full doc and spit out the errors, check after
### Medium ###
- Validate json after compile
- Ability to describe the app like a router (alternate to passing all the data into the init method).
- Ability to manually specify routes.
### High ###
- if a model has #/definitions, add those as models
- Better error messages in general so you don't need to debug
- Better error messages if a path variable was autmatically added but not found in common
- Ability to inject certain things into parameters. E.g. many GET routes will have GET /thing/:identifier would be nice to inject the name in there