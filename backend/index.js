import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { engine } from 'express-handlebars';


import https from 'https';
import fs from 'fs';


import {getColumnHeaderDictionary} from './stringDictionary.js';
import {GetInsertQueryString} from './SQLQueries.js';


const pages = ['actions', 'locations', 'plants', 'sensor_readings', 'sensors', 'updates', 'light_categories', 'action_types'];
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
    // In the future, we will need to fetch dynamically with every request
    for (const page of pages) {
        // Fetch table schema
        const [schemaResult] = await connection.execute(`DESCRIBE ${page}`);
        // Build schema as object (for help with forms)
        const schemaFields = Object.fromEntries(schemaResult.map(row => [row.Field, null]));


        // Get FK relationships from table
            // Yields eg
            //  [
            //    {
            //      COLUMN_NAME: 'plants_plant_id',
            //      REFERENCED_TABLE_NAME: 'plants',
            //      REFERENCED_COLUMN_NAME: 'plant_id'
            //    }
            //  ]
        // Derived from:
            // https://stackoverflow.com/questions/201621/how-do-i-see-all-foreign-keys-to-a-table-or-column
        // 5/16/2024
        const [fkResult] = await connection.execute(`
            SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_NAME = ?
            AND REFERENCED_TABLE_NAME IS NOT NULL
            `, [page]);


        // Fill FK fields with names for CRUD menus
        // TODO also do this with ENUMs
        for (const fk of fkResult) {
             // Get list of names
            const [names] = await connection.execute(`SELECT NAME FROM ${fk.REFERENCED_TABLE_NAME};`);
            schemaFields[fk.COLUMN_NAME] = names.map(row => row.NAME);
        }


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


    const app = express();
    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');


    app.use(express.static('frontend'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))
    //app.use(express.static("public"))


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
        app.post(`/${page}/create`, async (req, res) =>
            {
                const obj = JSON.parse(JSON.stringify(req.body));
               
                if(req.body !== null)
                {
                    const queryString = GetInsertQueryString(page, obj);
                    await connection.execute(queryString);
                    //Todo: must change response to update the table
                    res.redirect('/');
                }
                else{
                    res.status(401).send("Please check your stuff.");
                }
            }
            );
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
