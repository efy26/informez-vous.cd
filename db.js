// import pg from "pg";
// const { Pool } = pg;

// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     },
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 10000
// });

import 'dotenv/config';

import pg from "pg";
const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";
console.log("DATABASE_URL =", process.env.DATABASE_URL);

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false }
        : false
});