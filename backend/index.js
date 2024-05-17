import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { engine } from 'express-handlebars';

import https from 'https';
import fs from 'fs';

const pages = ['actions', 'locations', 'plants', 'sensor_readings', 'sensors', 'updates'];
const testData = {};

async function main() {
    console.log("Starting backend!");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    // This just uses the stuff we got once
    // In the future, we will need to fetch dynamically
    for (const page of pages) {
        // Fetch table schema
        const [schemaResult] = await connection.execute(`DESCRIBE ${page}`);
        const schemaFields = schemaResult.map(row => row.Field);

        // Fetch foreign key information
        const [fkResult] = await connection.execute(`
            SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?
            AND REFERENCED_TABLE_NAME IS NOT NULL
            `, [page]);

        // Construct the base query
        let baseQuery = `SELECT ${page}.*`;

        // Construct JOIN clauses for foreign keys
        let joinClauses = '';
        for (const fk of fkResult) {
            baseQuery += `, ${fk.REFERENCED_TABLE_NAME}.name AS ${fk.COLUMN_NAME}_name`;
            joinClauses += ` LEFT JOIN ${fk.REFERENCED_TABLE_NAME} ON ${page}.${fk.COLUMN_NAME} = ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`;
        }

        // Complete the query
        const fullQuery = `${baseQuery} FROM ${page}${joinClauses}`;

        // Fetch table data with the constructed query
        const [dataResult] = await connection.execute(fullQuery);
        testData[page] = [schemaFields, ...dataResult];
    }

    console.log(testData)

    const app = express();
    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

    app.use(express.static('frontend'));

    pages.forEach(page => {
        app.get(`/${page}`, (req, res) => {
            // Render the corresponding Handlebars template
            res.render('crud', {
                title: `${page.charAt(0).toUpperCase() + page.slice(1)} Page`,
                pageName: page,
                pages: pages,
                entries: testData[page]
            });
        });
    });

    // Define routes
    app.get('/', (req, res) => {
        res.render('index', {
            title: 'Plant Friend',
            pages: pages
        });
    });

    if (process.env.IS_PROD === "true") {
        if (typeof process.env.CERT_PATH === 'undefined') {
            throw new Error('CERT_PATH environment variable is not set.');
        }
        const privateKey = fs.readFileSync(path.join(process.env.CERT_PATH, "privkey.pem"), "utf8");
        const certificate = fs.readFileSync(path.join(process.env.CERT_PATH, "fullchain.pem"), "utf8");

        const credentials = { key: privateKey, cert: certificate };

        const httpsServer = https.createServer(credentials, app);

        httpsServer.listen(443, () => {
            console.log('HTTPS server running on port 443');
        });
        // redirect HTTP server
        const httpApp = express();
        httpApp.all('*', (req, res) => res.redirect(['https://', req.get('Host'), req.url].join('')));
        httpApp.listen(80, () => console.log(`HTTP redirect server listening`));
    } else { // Dev server
        app.listen(8000, () => {
            console.log('HTTP server running on port 8000');
        });
    }
}

main().catch(console.error);