
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
       next();
 });

app.use(cors());
app.use(bodyParser.json({limit: '60mb'}));
app.use(bodyParser.urlencoded({limit: '60mb', extended: true}));




const admin = require('./routes/admin');
app.use('/api/admin', admin);


const client = require('./routes/client');
app.use('/api/client', client);

const facture = require('./routes/facture');
app.use('/api/facture', facture);




app.listen(3000 , () => console.log("Local SILVER server is running "));