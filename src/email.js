const res = require('dotenv').config({path: '../.env'})
var path    = require('path');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// username + password
var options = {
	auth: {
		api_user: process.env.SENDGRID_USERNAME,
		api_key: process.env.SENDGRID_PASSWORD
	}
}
	
var mailer = nodemailer.createTransport(sgTransport(options));

var email = {
	to: ['colin.broderick@entsoe.eu'],
	from: 'agordillodelgado@hotmail.com',
	subject: 'Hi there',
	text: 'Awesome sauce',
	html: '<b>Awesome sauce</b>'
};

// mailer.sendMail(email, function(err, res) {
// 	if (err) { 
// 		console.log(err) 
// 	}
// 	console.log(res);
// });
mailer.sendMail(email).then((err,res) => {
            if (err) { 
                console.log(err) 
            }
            console.log(res)
        })
