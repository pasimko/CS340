-- Final query syntax derived from:
    -- https://stackoverflow.com/questions/201621/how-do-i-see-all-foreign-keys-to-a-table-or-column
    -- 5/16/2024

-- Locations Table --
INSERT INTO locations (name, is_indoors, light_category) VALUES ('placeholder_name', 1, 'bright indirect');
SELECT * FROM locations WHERE location_id = placeholder_location_id;
UPDATE locations SET name = 'updated_placeholder_name' WHERE location_id = placeholder_location_id;
DELETE FROM locations WHERE location_id = placeholder_location_id;

-- Plants Table --
INSERT INTO plants (name, date_added, locations_location_id) VALUES ('placeholder_name', CURDATE(), placeholder_location_id);
SELECT * FROM plants WHERE plant_id = placeholder_plant_id;
UPDATE plants SET name = 'updated_placeholder_name' WHERE plant_id = placeholder_plant_id;
DELETE FROM plants WHERE plant_id = placeholder_plant_id;

-- Sensors Table --
INSERT INTO sensors (name, sensor_type, data_units, status) VALUES ('placeholder_name', 'placeholder_sensor_type', 'placeholder_data_units', 1);
SELECT * FROM sensors WHERE sensor_id = placeholder_sensor_id;
UPDATE sensors SET name = 'updated_placeholder_name' WHERE sensor_id = placeholder_sensor_id;
DELETE FROM sensors WHERE sensor_id = placeholder_sensor_id;

-- Updates Table --
INSERT INTO updates (health_score, comment, image_location, update_date, plants_plant_id) VALUES (placeholder_health_score, 'placeholder_comment', 'placeholder_image_location', CURDATE(), placeholder_plant_id);
SELECT * FROM updates WHERE update_id = placeholder_update_id;
UPDATE updates SET health_score = updated_placeholder_health_score WHERE update_id = placeholder_update_id;
DELETE FROM updates WHERE update_id = placeholder_update_id;

-- Actions Table --
INSERT INTO actions (action_type, action_date, plants_plant_id) VALUES ('placeholder_action_type', CURDATE(), placeholder_plant_id);
SELECT * FROM actions WHERE sensor_reading_id = placeholder_sensor_reading_id;
UPDATE actions SET action_type = 'updated_placeholder_action_type' WHERE sensor_reading_id = placeholder_sensor_reading_id;
DELETE FROM actions WHERE sensor_reading_id = placeholder_sensor_reading_id;

-- Sensor Readings Table --
INSERT INTO sensor_readings (plants_plant_id, sensors_sensor_id, date_time, value) VALUES (placeholder_plant_id, placeholder_sensor_id, '2024-05-09 10:00:00', 'placeholder_value');
SELECT * FROM sensor_readings WHERE sensor_reading_id = placeholder_sensor_reading_id;
UPDATE sensor_readings SET value = 'updated_placeholder_value' WHERE sensor_reading_id = placeholder_sensor_reading_id;
DELETE FROM sensor_readings WHERE sensor_reading_id = placeholder_sensor_reading_id;

-- Get FKs from table
-- Get FK relationships from table
-- Yields
--      COLUMN_NAME: 'plants_plant_id',
--      REFERENCED_TABLE_NAME: 'plants',
--      REFERENCED_COLUMN_NAME: 'plant_id'
SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = placeholder AND REFERENCED_TABLE_NAME IS NOT NULL;
