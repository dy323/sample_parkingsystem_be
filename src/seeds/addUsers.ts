import {SAMPLE_SEED_EMAIL_TWO, SAMPLE_SEED_PHONE_ONE} from "../../configs/config";
import {encryptAES} from "../../src/utils/helper";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex: import("knex").Knex): Promise<void> {

  // Deletes ALL existing entries
  await knex('user').del()
  await knex('user').insert([
    { 
      id: 1,
      uuid: "1e9718f0-7983-4735-a948-aab6a5f8a9f6", 
      username: "dy323",
      psw: encryptAES("ultear938012"),  
      nric: 950211068790,
      member: 1659375693016,
      email: SAMPLE_SEED_EMAIL_TWO,
      phone: SAMPLE_SEED_PHONE_ONE,
    },
  ]);
};
