import express from "express";
import mysql from "mysql2/promise";
import path from "path";

import https from 'https';
import fs from 'fs';

async function main() {
    console.log("Starting backend!");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const queries = [
        `CREATE TABLE IF NOT EXISTS locations (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(45) NOT NULL,
            is_indoors TINYINT,
            light_type ENUM('full sun', 'partial shade', 'bright indirect')
        );`,
        `CREATE TABLE IF NOT EXISTS plants (
            id INT PRIMARY KEY AUTO_INCREMENT,
            nickname VARCHAR(45),
            date_added DATE,
            location_id INT,
            FOREIGN KEY (location_id) REFERENCES locations(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS activity (
            id INT PRIMARY KEY AUTO_INCREMENT,
            plant_id INT,
            care_type ENUM('water', 'repot', 'fertilize') NOT NULL,
            care_date DATE NOT NULL,
            FOREIGN KEY (plant_id) REFERENCES plants(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS updates (
            id INT PRIMARY KEY AUTO_INCREMENT,
            health_score INT,
            plant_id INT NOT NULL,
            image_path VARCHAR(255),
            notes VARCHAR(140),
            date DATE NOT NULL,
            FOREIGN KEY (plant_id) REFERENCES plants(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`,
    ]
for (const query of queries) {
        await connection.execute(query);
    }

    // create express server
    const app = express();

    const testQueries = [
        `INSERT INTO locations (name, is_indoors, light_type) VALUES
            ('Greenhouse', 1, 'full sun'),
            ('Backyard', 0, 'partial shade'),
            ('Living room', 1, 'bright indirect')
        ;`,
        `INSERT INTO plants (nickname, date_added, location_id) VALUES
            ('Tomato', '2024-04-01', 1),
            ('Cucumber', '2024-09-02', 1),
            ('Pepper', '2024-04-03', 1)
        ;`,
        `INSERT INTO plants (nickname, date_added, location_id) VALUES
            ('Lettuce', '2024-04-01', 2),
            ('Plum tree', '2019-04-02', 2),
            ('Maple tree', '2020-06-22', 2)
        ;`,
        `INSERT INTO plants (nickname, date_added, location_id) VALUES
            ('Aloe Vera', '2024-01-11', 3),
            ('Spider Plant', '2024-04-03', 3)
        ;`,
    ];
    for (const query of testQueries) {
        await connection.execute(query);
    }
    const testQuery = `SELECT * FROM plants WHERE MONTH(date_added) = 4;`
    app.get("/", async (req, res) => {
        const dbres = await connection.execute(testQuery);
        let base = "<h1>Plants planted in April:</h1>";
        res.send(base + JSON.stringify(dbres[0]));
    });

    // This doesn't matter until public deployment

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

