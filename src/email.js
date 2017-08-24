var sendemail   = require('sendemail').email; // no api key
var email = sendemail.email;
sendemail.set_template_directory('./emails');

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