var path = require('path');
module.exports = {

	development: {

		migrations: { tableName: 'knex_migrations' },
		seeds: { tableName: './seeds' },
		client: 'pg',
		connection: process.env.DATABASE_URL + '?ssl=true&sslmode=require' || 'pg://angel1:123456@localhost:5432/women',	
	  pool: {min: 2,max: 5}
       /* client: 'sqlite3',
        connection: {
        	filename: path.join(__dirname, 'db.sqlite')*/
        }

    }

/*var knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    user : 'admin',
    password : 'admin',
    database : 'women'
  }
  migrations: { tableName: 'knex_migrations' },
		seeds: { tableName: './seeds' },
});*/