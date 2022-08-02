/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex: import("knex").Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('rate').del()
  await knex('rate').insert([
    { first: 0, second: 2.00, remaining: 3.00, max: 200.00 },
    { first: 0, second: 2.00, remaining: 3.00, max: 200.00 },
    { first: 0, second: 2.00, remaining: 3.00, max: 200.00 },
    { first: 0, second: 2.00, remaining: 3.00, max: 200.00 },
    { first: 0, second: 2.00, remaining: 3.00, max: 200.00 },
    { first: 1.00, second: 3.00, remaining: 5.00, max: 300.00 },
    { first: 1.00, second: 3.00, remaining: 5.00, max: 300.00 },
  ]);
};
