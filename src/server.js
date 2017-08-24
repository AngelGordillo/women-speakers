import Hapi from 'hapi';
import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import routes from './routes'
import GUID from 'node-uuid';

const guid = GUID.v4();

//console.log(process.env.DATABASE_URL+ `?ssl=true` );
const db = require( 'knex' )(Knex.development);

console.log(db)
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



server.connection({ port: process.env.PORT || 8080});

server.register( require( 'hapi-auth-jwt' ), ( err ) => {
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




