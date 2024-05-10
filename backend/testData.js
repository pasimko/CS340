// Import necessary modules
import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';

// Function to read SQL from file and execute it
async function initializeDatabase() {
    try {
        // Read SQL from file
        const sql = await readFile('sql/TestData.sql', 'utf8');

        // Create a connection using environment variables
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        // Execute the SQL script
        const results = await connection.query(sql);

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Failed to initialize the database:', error);
    }
}

// Execute the function
initializeDatabase();
