const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');

/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});




app.listen(3000, () => {
    console.log(" Server is listening on port 3000");
})
