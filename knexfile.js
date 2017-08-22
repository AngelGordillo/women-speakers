var path = require('path');

module.exports = {


		migrations: { tableName: 'knex_migrations' },
		seeds: { tableName: './seeds' },
		client: 'pg',
		debug: true,
		//connection: process.env.DATABASE_URL || 'pg://angel1:123456@localhost:5432/women',
		connection: 'postgres://kwgxishsbflhir:53c5eed32140c7f4ac306d5d47bd1535646bb60eeb9ce2ee5f96ac472404c036@ec2-54-83-25-217.compute-1.amazonaws.com:5432/dcu5ge5vjntcuk?ssl=true',
		pool: {
			min: 2,
			max: 10
		}
       /* client: 'sqlite3',
        connection: {
        	filename: path.join(__dirname, 'db.sqlite')*/
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