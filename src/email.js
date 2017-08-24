var sendemail   = require('sendemail').email; // no api key

sendemail.set_template_directory('../emails');

var person = {
  name : "Angel",
  email: "angel.gordillodelgado@ext.entsoe.eu",
  subject:"Welcome to test :)"
}

sendemail('welcome', person, function(error, result){
  console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
  console.log(result);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
})
export default sendemail;