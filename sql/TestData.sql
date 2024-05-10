INSERT INTO locations (location_name, is_indoors, light_category) VALUES
        ('Greenhouse', 1, 'full sun'),
        ('Backyard', 0, 'partial shade'),
        ('Living room', 1, 'bright indirect')
        ;
INSERT INTO plants (nickname, locations_location_id) VALUES
        ('Tomato', 1),
        ('Cucumber', 1),
        ('Pepper', 1)
        ;
INSERT INTO plants (nickname, locations_location_id) VALUES
        ('Lettuce', 2),
        ('Plum tree', 2),
        ('Maple tree', 2)
        ;
INSERT INTO plants (nickname, locations_location_id) VALUES
        ('Aloe Vera', 3),
        ('Spider Plant', 3)
        ;

INSERT INTO sensors (sensor_name, sensor_type, data_units, status) VALUES
        ('sun sensor', 'solar', 'lux', 1),
        ('moisture meter', 'moisture', '%', 1),
        ('mood meter', 'happiness', 'smiles', 1)
        ;

INSERT INTO sensor_readings (sensors_sensor_id, plants_plant_id, value) VALUES
        (1, 1, '45'),
        (1, 2, '45'),
        (1, 3, '45'),
        (2, 7, '60'),
        (2, 8, '52'),
        (3, 5, '3'),
        (3, 6, '3')
        ;

INSERT INTO actions (action_type, plants_plant_id) VALUES
        ('water', 1),
        ('water', 2),
        ('water', 2),
        ('fertilize', 4),
        ('fertilize', 5),
        ('harvest', 1)
        ;
INSERT INTO updates (health_score, comment, plants_plant_id) VALUES
        (5, "Extra fragrant today!", 1),
        (4, NULL, 3)
        ;
