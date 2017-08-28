exports.up = function(knex, Promise) {
   return Promise.all([
    knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;'),
    knex
            .schema
            .createTable( 'users', function( usersTable ) {
                // Primary Key
                // usersTable.increments();

                // Data
                usersTable.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
                usersTable.string( 'name', 50 );
                usersTable.string( 'username', 50 ).unique();
                usersTable.string( 'email', 250 ).unique();
                usersTable.string( 'password', 128 );

                usersTable.timestamp( 'created_at' );

            } )

            
            ])
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
    ])
};