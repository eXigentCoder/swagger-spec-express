# swagger-spec-express
![alt text](https://api.travis-ci.org/eXigentCoder/swagger-spec-express.svg "Build Status")
Allows you to programmatically annotate your express routes with swagger info and then generate and validate your json spec file

##NB##
Please note that this module is still heavily under development, more information to come.

##todo##
Low - Currently populating rootDocument.responses but then injecting the responses directly into the operation. Should use the $ref
Low - Currently populating rootDocument.parameters but then injecting the responses directly into the operation. Should use the $ref
Low - validation of the add common item methods to ensure only the correct properties are added - will be okay if we validate the full doc and spit out the errors, check after
Low - validation of the metadata add - will be okay if we validate the full doc and spit out the errors, check after
Med - validate json after compile
High - if a model has #/definitions, add those as models