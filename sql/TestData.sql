INSERT INTO light_categories(category_id, name) VALUES
        (1, 'full sun'),
        (2, 'partial shade'),
        (3, 'bright indirect')
        ;

INSERT INTO action_types(action_type_id, name) VALUES
        (1, 'water'),
        (2, 'fertilize'),
        (3, 'harvest')
        ;

INSERT INTO locations (name, is_indoors, light_category) VALUES
        ('Greenhouse', 1, 1),
        ('Backyard', 0, 2),
        ('Living room', 1, 3)
        ;
INSERT INTO plants (name, locations_location_id) VALUES
        ('Tomato', 1),
        ('Cucumber', 1),
        ('Pepper', 1)
        ;
INSERT INTO plants (name, locations_location_id) VALUES
        ('Lettuce', 2),
        ('Plum tree', 2),
        ('Maple tree', 2)
        ;
INSERT INTO plants (name, locations_location_id) VALUES
        ('Aloe Vera', 3),
        ('Spider Plant', 3)
        ;

INSERT INTO sensors (name, sensor_type, data_units, status) VALUES
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
        (1, 1),
        (1, 2),
        (1, 2),
        (2, 4),
        (2, 5),
        (3, 1)
        ;
INSERT INTO updates (health_score, comment, plants_plant_id) VALUES
        (5, "Extra fragrant today!", 1),
        (4, NULL, 3)
        ;
