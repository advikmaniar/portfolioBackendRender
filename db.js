const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Needed for Railway
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projectLikes (
        id SERIAL PRIMARY KEY,
        projectName TEXT NOT NULL,
        userId TEXT NOT NULL,
        CONSTRAINT unique_project_user UNIQUE (projectName, userId)
    )
`;

pool.query(createTableQuery)
    .then(() => console.log("PostgreSQL Database Connected & Table Ready"))
    .catch(err => console.error("Database Error:", err));

module.exports = pool;
