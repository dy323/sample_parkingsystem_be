import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("member_status", (table)=> {
        table.integer("id").primary();
        table.string("type");
    })
    .createTable("member_ship", (table)=> {
        table.increments("id").primary();
        table.bigInteger("member").unique().unsigned;
        table.date("start");
        table.date("end");
        table.integer("type").unsigned();
        table.foreign("type").references("id").inTable("member_status");
    })
    .createTable("user", (table) => {
        table.increments("id").primary(); //inner use
        table.uuid("uuid").unsigned(); //expose encrypted to outside
        table.string("username");
        table.string("psw", 64);
        table.bigInteger("nric");
        table.bigInteger("member").unique().unsigned();
        table.string("email");
        table.string("phone");
        table.foreign("member").references("member").inTable("member_ship");
    })
    .createTable("reserved_slot", (table)=> {
        table.increments("id").primary();
        table.bigInteger("member").unsigned();
        table.string("slot");
        table.foreign("member").references("member").inTable("user");
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTableIfExists("reserved_slot")
    .dropTableIfExists("user")
    .dropTableIfExists("member_ship")
    .dropTableIfExists("member_status")
}

