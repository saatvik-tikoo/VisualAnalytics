var express = require('express')
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var cors = require('cors')

var app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var db = new sqlite3.Database('./Database/mydb.sqlite3', (err) => { 
	if (err) { 
		console.log('Error when accessing the database', err);
		throw 0;
	}
	console.log('Database Accessed!');
});

require('./gamerGateController')(app, db, jsonParser, urlencodedParser, cors);
 
app.listen(3000);