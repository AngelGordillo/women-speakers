import Knex from '../knexfile';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';
import Boom from 'boom';
const db = require( 'knex' )(Knex.development);


// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
{

    path: '/women',
    method: 'POST',
    config: {
        auth: {
            strategy: 'token',
        }
    },

    handler: ( request, reply ) => {
        //console.log(request.auth);
        const women = request.payload;

        if (!women.name) {
         return	reply(Boom.badRequest('you need to include a name'));
        }

        db('women')
         .insert({
         	name: women.name, 
         	owner: request.auth.credentials.scope
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
}
    ];


export default routes;