import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';
import Boom from 'boom';
const db = require( 'knex' )(Knex.development);


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
    console.log(options)
var mailer = nodemailer.createTransport(sgTransport(options));


// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
{

    path: '/women',
    method: 'POST',
/*    config: {
        auth: {
            strategy: 'token',
        }
    },*/

    handler: ( request, reply ) => {
        //console.log(request.auth);
        const women = request.payload;

        if (!women.name) {
         return	reply(Boom.badRequest('you need to include a name'));
        }

        db('women')
         .insert({
         	name: women.name,
            email: women.email,
            picture_url: women.picture_url,
            topic: women.topic,
            linkedin: women.linkedin,
            isPublic : false
         })
         .returning('id')
         .then(res => {
        	return reply({id: res[0]})

        })
        .catch( ( err ) => {
            reply(err);
        });

    }

},
{
    method: 'GET',
    path: '/women',
    handler: ( request, reply ) => {
        const query = db( 'women' ).select( '*' )
        //.where("isPublic", true);

        if (request.query.public && request.query.public == 'true') {
            query.where("isPublic", true)
        } else {
             query.where("isPublic", false)
        }

        var email = {
                    to: ['colin.broderick@entsoe.eu'],
                    from: 'agordillodelgado@hotmail.com',
                    subject: 'Hi there',
                    text: 'Awesome sauce',
                    html: '<b>Awesome sauce</b>'
                };

      let mailPromise = new Promise((resolve, reject) => {
         mailer.sendMail(email).then((err,res) => {
            if (err) { 
                console.log(err) 
                return reject(err);
            }
            resolve(res);
        })
        
        });

      return mailPromise
            // catch on the other side
            .then((success) => {

                console.log('mailPromise success', success);
                return reply(success);
            })
       
        // console.log(query.toString())
        // const getOperation = query.then( ( results ) => {

        //     // The second one is just a redundant check, but let's be sure of everything.
        //     // if( !results || results.length === 0 ) {
        //     //     reply({
        //     //         error: true,
        //     //         errMessage: 'no public women found',

        //     //     });

        //     // } else {
                

        //     // reply( {

        //     //     dataCount: results.length || 0,
        //     //     data: results,


        //     // } );
        //     // }
        // } )
        .catch( ( err ) => {

            reply( 'server-side error', err );

        } );

    }
},
{
 path: '/women/{id}',
    method: 'PUT',
    config: {

       
        pre: [

        {

            method: ( request, reply ) => {
                console.log(request.params)
                const { id } = request.params;
               
                db( 'women' ).where( {

                    id: id,

                } ).select( 'owner' ).then( ( [ result ] ) => {

                    if( !result ) {

                        reply( {

                            error: true,
                            errMessage: `the women with id ${ id } was not found`

                        } ).takeover();

                    }

                   return reply.continue();

                } );

            }

        }

        ],

    },
    handler: ( request, reply ) => {

        const { id } = request.params;
        const women  = request.payload;

        db( 'women' ).where( {

            id: id,

        } ).update( {

            name: women.name,
            email: women.email,
            topic: women.topic,
            picture_url: women.picture_url,
            isPublic: women.isPublic,

        } ).then( ( res ) => {

            reply( {

                message: 'successfully updated women'

            } );

        } ).catch( ( err ) => {

            reply( 'server-side error' );

        } );

    }
},
{
 path: '/womenValidate/{id}',
    method: 'PUT',
    handler: ( request, reply ) => {

        const { id } = request.params;
        const women  = request.query || {};
        // console.log(request.query)
        //console.log("payload: ", women, women.hasOwnProperty('isPublic'))
        //console.log("women", women, women.hasOwnProperty('isPublic'))
        if (!request.query) {
            return reply(Boom.badRequest('bad'));
        }
        
        let q = db( 'women' ).where( {

            id: id,

        } )

        .update( {

           isPublic: women.isPublic === "true" ? true : false,

        } )
        .returning('id')
        console.log(q.toString())

        q.then( ( res ) => {

            reply( {
                res: res,
                id: res[0],
                message: 'successfully updated women'

            } )

        } ).catch( ( err ) => {

            reply( err);

        } );

    }
}
    ];


export default routes;