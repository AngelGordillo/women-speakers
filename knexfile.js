var path = require('path');
module.exports = {

    development: {

        migrations: { tableName: 'knex_migrations' },
        seeds: { tableName: './seeds' },

        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, 'db.sqlite')
        }

    }

};
