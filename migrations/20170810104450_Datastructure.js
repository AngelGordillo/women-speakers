
exports.up = function(knex, Promise) {
   return Promise.all([
    knex
            .schema
            .createTable( 'users', function( usersTable ) {

                // Primary Key
                usersTable.increments();

                // Data
                usersTable.string( 'name', 50 );
                usersTable.string( 'username', 50 ).unique();
                usersTable.string( 'email', 250 ).unique();
                usersTable.string( 'password', 128 );

                usersTable.timestamp( 'created_at' );

            } ),

            knex
            .schema.createTable( 'women', function( womenTable ) {

                // Primary Key
                womenTable.increments();
                womenTable.string( 'owner', 36 ).references( 'id' ).inTable( 'users' );

                // Data
                // Each chainable method creates a column of the given type with the chained constraints. For example, in the line below, we create a column named `name` which has a maximum length of 250 characters, is of type string (VARCHAR) and is not nullable. 
                //womenTable.string( 'guid', 36 ).unique();
                womenTable.string( 'name', 250 );
                womenTable.string( 'email', 250 );
                womenTable.string( 'picture_url', 250 );
                womenTable.string( 'topic', 250 );
                womenTable.string( 'linkedin', 250 );
                womenTable.boolean( 'isPublic' );
                womenTable.timestamp( 'created_at' );

            } )
            ])
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('women')
    ])
};
