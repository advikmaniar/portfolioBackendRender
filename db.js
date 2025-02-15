const { Pool } = require("pg");
require("dotenv").config();
const { URL } = require("url");

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing in .env file!");
    process.exit(1);
}

const databaseUrl = new URL(process.env.DATABASE_URL);

const pool = new Pool({
    user: databaseUrl.username,
    password: databaseUrl.password,
    host: databaseUrl.hostname, 
    port: databaseUrl.port,
    database: databaseUrl.pathname.replace("/", ""),
    ssl: databaseUrl.hostname.includes("railway") ? { rejectUnauthorized: false } : undefined,
});

pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL 🚀");
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
    .then(() => console.log("✅ Table 'projectLikes' is ready!"))
    .catch(err => console.error("❌ Database Error:", err));

module.exports = pool;

