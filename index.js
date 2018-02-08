//Start server by typing node index.js in the cmd prompt
//Open browser and navigate to localhost:3000 to launch site
//-----SETUP-----
//Import the express module
var express = require('express');
var router = express.Router();

var app = express();
//Imports File System module which comes pre-installed with Express
var fs = require('fs');

//Block header from containing info about the server
app.disable('x-powered-by');

//Imports and sets up Handlebars module, named for its use of curly brackets {{}}
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Imports bodyParser
var bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

//Sets port to 3000
app.set('port', process.env.PORT || 3000);

//Shortens file paths when calling on directories
//EX: can now just do /img/xxx or /css/ccc and take directly from public folder
app.use(express.static(__dirname + '/public'));

//-----ROUTES & RESTful API-----
//Adds a number to each page accessed console log
var consoleNum = 0;
//Add Console Log Msgs for each page accessed
app.use(function (req, res, next) {
	consoleNum += 1;
	console.log(consoleNum + "- Looking for URL : " + req.url);
	next();
});

//ROOT, renders home.handlebars
app.get('/', function(req, res){
	res.render('home');
});
//Control page, renders control.handlebars
app.get('/users/control', function(req, res){
	res.render('control');
});
//REALTIME SHOW, renders realtime.handlebars
app.get('/realtime/show', function(req, res){
	res.render('realtime');
});
//REACT CONTROL
app.get('/users/reactcontrol', function(req, res){
	res.render('reactcontrol');
});
//REACT SHOW
app.get('/users/reactshow', function(req, res){
	res.render('reactshow');
});

//#2 and #3.2
//REALTIME DATA, generates a random number and puts it in a JSON Object
app.get('/realtime/data', function(req, res){
	rNum = Math.floor((Math.random() * 999) + 1);
	res.json({"data": rNum });
});

//Load and Parse the JSON 'Database' and assign it to a variable
var usersJSON = fs.readFileSync('./users.json','utf8');
usersJSON2 = JSON.parse(usersJSON);

//Users page should display a JSON database
app.get('/users', function(req, res){
	console.log ("You accessed a(n) \'" + typeof usersJSON2 + "\' type called: " + "usersJSON2 via app.get/users");
	res.send(usersJSON);
});

//#1 - PUT aka update
app.put('/users', function(req, res){
	var body = req.body;
	console.log ("You accessed a(n) \'" + typeof usersJSON2 + "\' type called: " + "usersJSON2 via app.put/users. Your request was: " + body);
	//insert PUT code...
	res.send("Your PUT request went through properly");
});
//#1 - DELETE aka remove/delete
app.delete('/users', function(req, res){
	var body = req.body;
	console.log ("You accessed a(n) \'" + typeof usersJSON2 + "\' type called: " + "usersJSON2 via app.delete/users. Your request was: " + body);
	//insert delete code...
	res.send("Your DELETE request went through properly");
});
// #1 - POST aka create
// Update json using the form from /users/control
app.post('/users', function(req, res){
	var newBody = req.body;
	var newid = Number(newBody.id);
	usersJSON2['theUsers'].push(newBody); //https://stackoverflow.com/questions/18884840/adding-a-new-array-element-to-a-json-object
	JSONstr = JSON.stringify(usersJSON2, null, 2);
	/*if(users[id]){
		var reply = {
			msg: "ID already exists."
		}
	}else{
	users[id] = firstname + " " + lastname;*/

	newBody = JSON.stringify(newBody, null, 2);
	fs.writeFile('./users.json', JSONstr, function (err) {
		if (err) throw err;
		console.log ("Successfully POSTed via app.post/users. Your request contained the following: " + newBody);
		res.send("Your user with id of " + newBody + " has been added via POST!");
	});
});

//Function defines which port to listen to
app.listen(app.get('port'), function(){
	console.log("0- Express started on http://localhost:" + app.get('port') + " press Ctrl-C to terminate");
});