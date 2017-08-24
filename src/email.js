var path = require('path');
var sendemail   = require('sendemail').email; // no api key
var email = sendemail.email;

var dir = path.join(__dirname, "/templates/"); // unresolved
/*dir = path.resolve(dir);*/
sendemail.set_template_directory(dir);
console.log(dir);
var person = {
  name : "Angele",
  email: "angel.gordillodelgado@ext.entsoe.eu",
  subject:"Welcome to test :)"
}

/*email('welcome', person, function(error, result){
  console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
  console.log(result);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
})*/