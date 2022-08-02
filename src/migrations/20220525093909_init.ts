import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("rate", (table)=> {
        table.increments("day").unsigned().primary();
        table.decimal("first",12,2);
        table.decimal("second",12,2);
        table.decimal("remaining",12,2);
        table.decimal("max",12,2);
    })
    .createTable("transaction", (table) => {
        table.integer("id").primary();
        table.uuid("order_no").unsigned();
        table.string("plate");
        table.decimal("price",12,2);
    })
    .createTable("punch_in", (table)=> {
        table.integer("id").primary();
        table.foreign("id").references("id").inTable("transaction");
        table.date("in_date");
        table.time("in_time");
    })
    .createTable("punch_out", (table)=> {
        table.integer("id").primary();
        table.foreign("id").references("id").inTable("transaction");
        table.date("out_date");
        table.time("out_time")
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTableIfExists("rate")
    .dropTableIfExists("punch_in")
    .dropTableIfExists("punch_out")
    .dropTableIfExists("transaction")
}

