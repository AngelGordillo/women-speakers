
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('women').del()
    .then(function () {
      // Inserts seed entries
      return knex('women').insert([
             {name: 'testWoman1',  
              email: 'angel.gordillodelgado@ext.entsoe.eu',
              picture_url: 'http://pngimg.com/upload/pigeon_PNG3423.png',
              topic: 'network',  linkedin:'default', isPublic:'false', owner:1
            }
      ]);
    });
};
