//var path = require('path');

module.exports = {
	development: {
		client: 'pg',
		 connection: process.env.DATABASE_URL + '?ssl=true'
	},
	production: {
		client: 'pg',
		 connection: process.env.DATABASE_URL + '?ssl=true'
	}

    }

/*

var knex = require('knex')({
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
});
production: {

			migrations: { tableName: 'knex_migrations' },
			seeds: { tableName: './seeds' },
			client: 'pg',
			//connection: 'postgres://iisqrfbzhbdobs:ad86925652584af73118347a47d6eadb47b41ce1b8a4477315620ab0c9db87c5@ec2-54-163-227-202.compute-1.amazonaws.com:5432/d4hupitm5nsu8',
			ssl:true,
			connection: process.env.DATABASE_URL + '?ssl=true&sslmode=require' || 'pg://angel1:123456@localhost:5432/women',	
		  pool: {min: 2,max: 5}
	       /* client: 'sqlite3',
	        connection: {
	        	filename: path.join(__dirname, 'db.sqlite')
	        }

    }
*/

