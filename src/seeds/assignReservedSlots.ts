/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex: import("knex").Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('reserved_slot').del()
  await knex('reserved_slot').insert([
    { 
      member: 1659375693016,
      slot: "A-1-1"
    },
    { 
      member: 1659375693016,
      slot: "A-1-2"
    },
  ]);
};
