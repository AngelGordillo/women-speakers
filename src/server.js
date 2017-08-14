import Hapi from 'hapi';
import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import routes from './routes'
import GUID from 'node-uuid';
const db = require( 'knex' )(Knex.development);
const guid = GUID.v4();
//create a new server instance
const server = new Hapi.Server();

server.connection( {
    port: 8080
});
// .register(...) registers a module within the instance of the API. The callback is then used to tell that the loaded module will be used as an authentication strategy. 
server.register( require( 'hapi-auth-jwt' ), ( err ) => {

    server.auth.strategy( 'token', 'jwt', {

        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',

        verifyOptions: {
           algorithms: [ 'HS256' ],
       }

   } );
    /* DOESN WORK ??????
     // We move this in the callback because we want to make sure that the authentication module has loaded before we attach the routes. It will throw an error, otherwise. 
      routes.forEach( ( route ) => {

        console.log( `attaching ${ route.path }` );
        server.route( route );

    } );*/

} );

//SHOW WOMEN
server.route({

    method: 'GET',
    path: '/women',
    handler: ( request, reply ) => {

        const getOperation = db( 'women' ).select( '*' ).then( ( results ) => {

            // The second one is just a redundant check, but let's be sure of everything.
            if( !results || results.length === 0 ) {
                reply({
                    error: true,
                    errMessage: 'no public women found',

                });

            }

            reply( {

                dataCount: results.length,
                data: results,

            } );

        } ).catch( ( err ) => {

            reply( 'server-side error' );

        } );

    }

} );

server.route( {

    path: '/users',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        const { username, password } = request.payload;

        return db( 'users' )
        .where("username", username )
        .select( 'username', 'password' )
        .then( ( results ) => {
            const user = results[0];
           if( user.password === password && user.username === username ){

            const token = jwt.sign( {
            // You can have anything you want here. ANYTHING. As we'll see in a bit, this decoded token is passed onto a request handler.
            username,
            scope: user.username,

        }, 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {

            algorithm: 'HS256',
            expiresIn: '1h',

        });

            return reply({token,scope: user.username});
        }else{
            reply('wrong username or password');
        }

    });





    }




} );

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }

    console.log( `Server started at ${ server.info.uri }` );

});
//  CREATE A WOMEN
server.route( {

    path: '/women',
    method: 'POST',

    handler: ( request, reply ) => {

        const { women } = request.payload;

    }

} );



 Knex( 'women' ).insert( {

    owner: request.auth.credentials.scope,
    name: women.name,
    picture_url: bird.picture_url,
    guid,

} ).then( ( res ) => {

    reply( {

        data: guid,
        message: 'successfully created bird'

    } );

} ).catch( ( err ) => {

    reply( 'server-side error' );

} );