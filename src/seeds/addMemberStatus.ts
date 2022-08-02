/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex: import("knex").Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('member_status').del()
  await knex('member_status').insert([
    {id: 1, type: "regular"},
    {id: 2, type: "seasonal"}
  ]);
};
