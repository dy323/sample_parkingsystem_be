/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex: import("knex").Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('member_ship').del()
  await knex('member_ship').insert([
    { 
      member: 1659375693016,
      start: knex.fn.now(),
      end: knex.raw(`? + ?::INTERVAL`, [knex.fn.now(), '30 day']),
      type: 2
    },
  ]);
};
