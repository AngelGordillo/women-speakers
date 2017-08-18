import Knex from '../knexfile';
import GUID from 'node-uuid';
import jwt from 'jsonwebtoken';
const db = require( 'knex' )(Knex.development);
const routes = [

    {

        path: '/women',
        method: 'GET',
        handler: ( request, reply ) => {

            db( 'women' ).select('id', 'name', 'topic', 'picture_url' ).then( ( results ) => {

                if( !results || results.length === 0 ) {

                    reply( {

                        error: true,
                        errMessage: 'no public women found',

                    } );

                }

                reply( {

                    dataCount: results.length,
                    data: results,

                } );

            } ).catch( ( err ) => {

                reply( 'server-side error' );

            } );

        }

    },

   

    {

        path: '/women',
        method: 'POST',
    
        handler: ( request, reply ) => {

            const women = request.payload;

         

            db( 'women' ).insert( {

                owner: request.auth.credentials,
                name: women.name,
                topic: women.topic,
                picture_url: women.picture_url,
                

            } ).then( ( res ) => {

                reply( {

                    
                    message: 'successfully created women'

                } );

            } ).catch( ( err ) => {

                reply( 'server-side error' );

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

                        const { id } = request.params;

                        db( 'women' ).where( {

                            id: id,

                        } ).select( 'owner' ).then( ( [ result ] ) => {

                            if( !result ) {

                                reply( {

                                    error: true,
                                    errMessage: `the bird with id ${ id } was not found`

                                } ).takeover();

                            }

                         

                            return reply.continue();

                        } );

                    }

                }

            ],

        },
        handler: ( request, reply ) => {

            const { id } = request.params
                ,  women     = request.payload;

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