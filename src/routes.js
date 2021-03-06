import Hapi from 'hapi';
import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';
import Boom from 'boom';
const db = require( 'knex' )(Knex.development);
var path    = require('path');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['x-requested-with']
      }
    }
  }
});

const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations'
  }
});

server.connection({port: process.env.PORT});

server.register(require('hapi-auth-jwt2'), function (err) {
  server.auth.strategy('jwt', 'jwt', {
    key: new Buffer(process.env.AUTH0_SECRET, 'base64') ,
    validateFunc: function (decoded, request, callback) {
      if (decoded) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    verifyOptions: {
      algorithms: ['HS256'],
      audience: process.env.AUTH0_CLIENT_IDE
    }
  });

  server.auth.default('jwt');
// username + password
var options = {
    auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD,

    }
}
console.log(options)
var mailer = nodemailer.createTransport(sgTransport(options));

var idWoman;


/*server.route({


    path: '/women',
    method: 'POST',
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
          topic: women.topic.toString(),
          linkedin: women.linkedin,
          isPublic : false
      })
       .returning('id') 
       .then( function (res) {
      
        var email = {
            to: women.email,
            from: 'ENTSOE-EWOMENSPEAKERS@blah.com',
            subject: 'Verify your account ' + women.name,
            html: '<p> Go to activate or delete your account (more details)</p>' + '<a href="https://driver-visitors-40426.netlify.com/activateAccount?'+res[0]+'">GO</a> ',
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
            //return reply({id: res[0]})

        })
       .catch( ( err ) => {
        reply(err);
    });

   }

});*/
server.route({
    method: 'GET',
    path: '/women',

    handler: ( request, reply ) => {
        const query = db( 'women' ).select( '*' )
        //.where("isPublic", false);

        if (request.query.public && request.query.public == 'true') {
            query.where("isPublic", true)
        } else {
           query.where("isPublic", false)
       }

       
        // console.log(query.toString())
        query.then( ( results ) => {

            //The second one is just a redundant check, but let's be sure of everything.
            if( !results || results.length === 0 ) {
               reply({
                   error: true,
                   errMessage: 'no public women found',

               });

           } else {


               reply( {

                   dataCount: results.length || 0,
                   data: results,


               } );
           }
       } )
        .catch( ( err ) => {

            reply( 'server-side error', err );

        } );

    }
});
/*server.route({
    method: 'GET',
    path: '/women/{id}',
    handler: ( request, reply ) => {
      const { id } = request.params;
        const query = db( 'women' ).select( '*' ).where({id: id});

       
        // console.log(query.toString())
        query.then( ( results ) => {

            //The second one is just a redundant check, but let's be sure of everything.
            if( !results || results.length === 0 ) {
               reply({
                   error: true,
                   errMessage: 'no public women found',

               });

           } else {


               reply( {

                   dataCount: results.length || 0,
                   data: results,


               } );
           }
       } )
        .catch( ( err ) => {

            reply( 'server-side error', err );

        } );

    }
});
server.route({
   path: '/women/{id}',
   method: 'PUT',
   
handler: ( request, reply ) => {

    const { id } = request.params;
    const women  = request.payload;

    db( 'women' ).where( {

        id: id,

    } ).update( {

        name: women.name,
        email: women.email,
        topic: women.topic.toString(),
        picture_url: women.picture_url,
        linkedin: women.linkedin,
        isPublic: women.isPublic,

    } ).then( ( res ) => {

        reply( {

            message: 'successfully updated women'

        } );

    } ).catch( ( err ) => {

        reply( 'server-side error' );

    } );

  }
});
server.route({
   path: '/womenValidate/{id}',
   method: 'GET',
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

         isPublic: women.isPublic === "true" ? true : true,

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
});
server.route({
   path: '/womenDelete/{id}',
   method: 'delete',
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

        .del()
        .returning('id')
        console.log(q.toString())

        q.then( ( res ) => {

            reply( {
                res: res,
                id: res[0],
                message: 'successfully deleted women'

            } )

        } ).catch( ( err ) => {

            reply( err);

        } );

    }
});*/

