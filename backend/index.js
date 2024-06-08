import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import {create} from 'express-handlebars';

import https from 'https';
import fs from 'fs';

import * as SQLQueries from './SQLQueries.js';
import * as dataManipulations from './dataManipulations.js'
import * as handlebarsHelpers from './handlebarsHelpers.js'

const pages = {'sensors':'Sensors', 'light_categories':'Light Categories', 'action_types':'Action Types', 'actions':'Actions', 'plants':'Plants', 'locations':'Locations', 'sensor_readings':'Sensor Readings', 'updates':'Updates'};
let fullData = {}; //contains all data for all pages

export async function runServer() {
    dotenv.config();

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    //establish all data in fullData object
    for (const page of Object.keys(pages)) {
        // Fetch table schema
        const fullQuery = SQLQueries.GetFullDataTableQuery(page);
        // Fetch table data with the constructed query
        const [dataResult] = await connection.execute(fullQuery);
        fullData[page] = [...dataResult];
    }

    const primaryKeys = await connection.execute(SQLQueries.GetPrimaryKeysQuery());
    const primaryKeyDictionary = dataManipulations.GetPrimaryKeyDictionary(primaryKeys);

    const app = express();
    const handlebars = create({ defaultLayout: 'main' });
    handlebars.handlebars.registerHelper('formatDate', handlebarsHelpers.formatDate);
    handlebars.handlebars.registerHelper('formatDateTime', handlebarsHelpers.formatDateTime);

    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');
    app.use(express.static('frontend'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))

    Object.keys(pages).forEach(page => {
        app.get(`/${page}`, async (req, res) => {
            const fullQuery = SQLQueries.GetFullDataTableQuery(page);
            const [dataResult] = await connection.execute(fullQuery);
            fullData[page] = [...dataResult];
            let pickerOptions = {};
            pickerOptions.plantPickerOptions = dataManipulations.GetFKDictionary(fullData, `plants`, `plant_id`,`name`);
            pickerOptions.sensorPickerOptions = dataManipulations.GetFKDictionary(fullData, `sensors`, `sensor_id`, `name`);
            pickerOptions.locationPickerOptions = dataManipulations.GetFKDictionary(fullData, `locations`, `location_id`, `name`);
            pickerOptions.lightCategoriesPickerOptions = dataManipulations.GetFKDictionary(fullData,`light_categories`, `category_id`, `name`);
            pickerOptions.actionTypesPickerOptions = dataManipulations.GetFKDictionary(fullData,`action_types`, `action_type_id`, `name`);
            
            // Render the corresponding Handlebars template
            res.render(page, {title: pages[page], entries: fullData[page], pages: pages, pickerOptions: pickerOptions });

        });
        app.post(`/${page}/create`, async (req, res) =>
            {
                const obj = JSON.parse(JSON.stringify(req.body));
                if(req.body !== null)
                {
                    const queryString = SQLQueries.InsertQueryString(page, obj);
                    await connection.execute(queryString);
                    res.redirect(req.get('referer'));
                }
                else{
                    res.status(401).send("Please check your stuff.");
                }
            }
            );
        
        app.post(`/${page}/update`, async (req, res) =>
            {
                const obj = JSON.parse(JSON.stringify(req.body));
                console.log(obj);
                if(req.body !== null)
                    {
                        const primaryKey = primaryKeyDictionary[page];
                        const queryString = SQLQueries.UpdateQueryString(page, obj, primaryKey);
   
                        console.log(queryString);
                        await connection.query(queryString);
 
                        res.redirect(req.get('referer'));
                    }
                    else{
                        res.status(401).send("Please check your stuff.");
                    }
            }
        );
        app.post(`/${page}/delete`, async (req, res) =>
            {
                const obj = JSON.parse(JSON.stringify(req.body));
                if(req.body !== null)
                    {
                        const primaryKey = primaryKeyDictionary[page];
                        const queryString = SQLQueries.DeleteQueryString(page, obj, primaryKey);
                        await connection.execute(queryString);
                        res.redirect(req.get('referer'));
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
        app.listen(process.env.PORT_NUMBER, () => {
            console.log(`HTTP server running on port ${process.env.PORT_NUMBER}`);
        });
    }
}


