The Heroku deployment of the app can be found at:
https://tranquil-atoll-28380.herokuapp.com/

Currently mapped routes:
* GET /api/persons - fetch list of persons
* GET /api/persons/:id - fetch single person with numeric id
* DELETE /api/persons/:id - delete single person with numeric id
* POST /api/persons/ - add new person. Must have "name" and "number" properties attached to the request body
