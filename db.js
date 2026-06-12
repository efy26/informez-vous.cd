import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
    user: "m2",
    host: "localhost",
    database: "newsinfo",
    password: "postgresNewInfo",
    port: 5432,
});