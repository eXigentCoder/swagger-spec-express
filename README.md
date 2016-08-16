# swagger-spec-express
![alt text](https://api.travis-ci.org/eXigentCoder/swagger-spec-express.svg "Build Status")
Allows you to programmatically annotate your express routes with swagger info and then generate and validate your json spec file

##NB##
Please note that this module is still heavily under development, more information to come.

##ToDo##
### Low ###
- Currently populating rootDocument.responses but then injecting the responses directly into the operation. Should use the $ref
- Currently populating rootDocument.parameters but then injecting the responses directly into the operation. Should use the $ref
- Validation of the add common item methods
- Validation of the metadata add
### Medium ###
- Ability to describe the app like a router (alternate to passing all the data into the init method).
- Ability to manually specify routes.
- Update document with how to use the library when closer to a definied standard.
### High ###
- Better error messages in general so you don't need to debug
- Ability to inject certain things into parameters. E.g. many GET routes will have GET /thing/:identifier would be nice to inject the name in there