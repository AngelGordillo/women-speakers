var path    = require('path'); // used to resolve relative paths
var config  = path.resolve(__dirname+'/../config.env'); // load config file
var env     = require('env2')(config);

var sendemail = require('../lib/index.js'); // no api key
var email     = sendemail.email;

var dir = __dirname + '../emails'; // unresolved
dir = path.resolve(dir);
sendemail.set_template_directory(dir); // set template directory
var person = {
  name : "Angel",
  email: "angel.gordillodelgado@ext.entsoe.eu",
  subject:"Welcome to test :)"
}

email('welcome', person, function(error, result){
  console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
  console.log(result);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
})