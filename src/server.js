import Hapi from 'hapi';
import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import Boom from 'boom';
const jwksRsa = require('jwks-rsa');
//import routes from './routes'
import GUID from 'node-uuid';
const guid = GUID.v4();


//console.log(process.env.DATABASE_URL+ `?ssl=true` );
const db = require( 'knex' )(Knex.development);

const server = new Hapi.Server({
  connections: {
    routes: {
        //cors: true
        cors: {
            origin: ['*'],
            additionalHeaders: ['x-requested-with']
        }
    }
}
});


server.connection({ port: process.env.PORT || 5000});

/*server.register( require( 'hapi-auth-jwt' ), ( err ) => {
    server.auth.strategy( 'token', 'jwt', {
        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
        verifyOptions: {
           algorithms: [ 'HS256' ],
       }
   } );  
    routes.forEach( ( route ) => {
        console.log( `attaching ${ route.path }` );
        server.route( route );
    } );
} );*/

server.register(require('hapi-auth-jwt2'), function (err) {
  server.auth.strategy('jwt', 'jwt', {
     complete: true,
    key: jwksRsa.hapiJwt2Key({
        cache:true,
        rateLimit: true,
        jwksRequestPerMinute:5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    validateFunc: function(decoded, request, callback) {
        if (decoded && decoded.sub) {
            return callback(null, true)
     }
     return callback(null, false);
    },
    verifyOptions: {
      algorithms: ['RS256'],
      audience: process.env.AUTH0_CLIENT_ID,
      issuer:`https://${process.env.AUTH0_DOMAIN}/`
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



server.route({
    method: 'GET',
    path: '/women',
    config: {auth: 'jwt'},
    handler: ( request, reply ) => {
       
            console.log(request.auth.credentials)
        const roles = request.auth.credentials.roles;

        let query = db('women').select()

        if (roles.indexOf('admin') > -1) {
            query = query
        } else {
            query = query.where("email", request.auth.credentials.email)
        }


        // if (request.query.public && request.query.public == 'true') {
        //     query.where("isPublic", true)
        // } else {
        //    query.where("isPublic", false)
        // }

       
        console.log(roles);
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
    method: 'GET',
    path: '/women/{id}',
    config: {auth: {mode: 'optional'}},
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
   config: {auth: 'jwt'},
handler: ( request, reply ) => {

    const admin = request.auth.credentials.roles.indexOf('editor') > -1;
    
    if (admin) {
        return reply(Boom.unauthorized("You've made a big mistake"))
    }

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


    path: '/women',
    method: 'POST',
    config: {auth: 'jwt'},
    handler: ( request, reply ) => {

        const not_admin = request.auth.credentials.roles.indexOf('admin') === -1;
    
        if (not_admin) {
            return reply(Boom.unauthorized("You've made a big mistake"))
        }

        //console.log(request.auth);
        const women = request.payload;

        if (!women.name) {
           return   reply(Boom.badRequest('you need to include a name'));
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

});

});

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }

    console.log( `Server started at ${ server.info.uri }` );

});




