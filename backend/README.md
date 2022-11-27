# BACKEND README
Backend was built with flask application and serves flex_records
frontend.
Main purpose is to connect the frontend to the database - Mongodb.
## Packages
* pymongo
* Flask
* Flask-CORS

# API Endpoints:
##GET /records/:id
Fetches the records associated with the id
Returns a JSON having all the records and data associated with that ID with 200 status code if successful

## POST /records/
Accepts a payload and validates it before persisting in the database
Returns a JSON of the payload and a 201 status code if successfull

## PUT /records/
Accepts a payload and validates it before persisting in the database, ID is retrived from the payload and checked if record exists
Returns a JSON of the payload and a 200 status code if successfull
