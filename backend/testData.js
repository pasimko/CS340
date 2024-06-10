import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';

export async function populateDatabase() {
    try {
        const sql = await readFile('sql/TestData.sql', 'utf8');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        const results = await connection.query(sql);

        await connection.end();
    } catch (error) {
        console.error('Failed to initialize the database:', error);
    }
}
// populateDatabase();
