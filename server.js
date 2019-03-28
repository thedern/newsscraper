// requires
const express = require('express');
const exphbs = require("express-handlebars");

// create express app
const app = express();

// set application port
const PORT = process.env.PORT || 9000;

// set static directory
app.use(express.static('public'));

// enable access to request body
// NOTE: this must go BEFORE router so that router can parse the req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set views engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// import the router mini app from ./routes/api_router
const apiRouter = require('./routes/api_router');

// use imported requires router, send all requests for '/api' to the api router.
app.use(apiRouter);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});