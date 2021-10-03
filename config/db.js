var mysql = require('mysql'); 

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port : 8889, 
    database: "silver",
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected SILVER DATABASE");
  });

  module.exports = connection;