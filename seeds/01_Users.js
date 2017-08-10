
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
                    
        {name: 'test1', username: 'masterTest1', email: 'angel.gordillodelgado@ext.entsoe.eu', password: '111111'},
        {name: 'test2', username: 'masterTest2', email: 'angel.gordillodelgado1@ext.entsoe.eu', password: '111111'}

      ]);
    });
};
