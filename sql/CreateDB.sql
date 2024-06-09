DROP DATABASE IF EXISTS `cs340_thurmesk`;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `cs340_thurmesk` DEFAULT CHARACTER SET utf8 ;
USE `cs340_thurmesk` ;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`light_categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) UNIQUE NULL,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`locations` (
  `location_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) UNIQUE NULL,
  `is_indoors` TINYINT NOT NULL DEFAULT 1,
  `light_category` INT NOT NULL,
  FOREIGN KEY (`light_category`) 
  REFERENCES `cs340_thurmesk`.`light_categories` (`category_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
  ,
  PRIMARY KEY (`location_id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`plants` (
  `plant_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `date_added` DATE NOT NULL DEFAULT (CURDATE()),
  `locations_location_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`plant_id`),
  INDEX `fk_plants_locations1_idx` (`locations_location_id` ASC),
  CONSTRAINT `fk_plants_locations1`
    FOREIGN KEY (`locations_location_id`)
    REFERENCES `cs340_thurmesk`.`locations` (`location_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`sensors` (
  `sensor_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `sensor_type` VARCHAR(45) NULL,
  `data_units` VARCHAR(45) NULL,
  `status` ENUM('on', 'off') NOT NULL,
  PRIMARY KEY (`sensor_id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`updates` (
  `update_id` INT NOT NULL AUTO_INCREMENT,
  `health_score` INT NOT NULL,
  `comment` VARCHAR(125) NULL,
  `image_location` VARCHAR(250) NULL,
  `update_date` DATE NOT NULL DEFAULT (CURDATE()),
  `plants_plant_id` INT NOT NULL,
  PRIMARY KEY (`update_id`),
  INDEX `fk_updates_plants1_idx` (`plants_plant_id` ASC),
  CONSTRAINT `fk_updates_plants1`
    FOREIGN KEY (`plants_plant_id`)
    REFERENCES `cs340_thurmesk`.`plants` (`plant_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`action_types` (
  `action_type_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) UNIQUE NULL,
  PRIMARY KEY (`action_type_id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`actions` (
  `action_id` INT PRIMARY KEY AUTO_INCREMENT,
  `action_type` INT NOT NULL,
  `action_date` DATE NOT NULL DEFAULT (CURDATE()),
  `plants_plant_id` INT NOT NULL,
  FOREIGN KEY (`action_type`) 
  REFERENCES `cs340_thurmesk`.`action_types` (`action_type_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX `fk_actions_plants1_idx` (`plants_plant_id` ASC),
  CONSTRAINT `fk_actions_plants1`
    FOREIGN KEY (`plants_plant_id`)
    REFERENCES `cs340_thurmesk`.`plants` (`plant_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cs340_thurmesk`.`sensor_readings` (
  `sensor_reading_id` INT PRIMARY KEY AUTO_INCREMENT,
  `plants_plant_id` INT NOT NULL,
  `sensors_sensor_id` INT NOT NULL,
  `date_time` DATETIME NULL,
  `value` VARCHAR(45) NULL,
  -- PRIMARY KEY (`sensor_reading_id`),
  INDEX `fk_plants_has_sensors_sensors1_idx` (`sensors_sensor_id` ASC),
  INDEX `fk_plants_has_sensors_plants_idx` (`plants_plant_id` ASC),
  CONSTRAINT `fk_plants_has_sensors_plants`
    FOREIGN KEY (`plants_plant_id`)
    REFERENCES `cs340_thurmesk`.`plants` (`plant_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_plants_has_sensors_sensors1`
    FOREIGN KEY (`sensors_sensor_id`)
    REFERENCES `cs340_thurmesk`.`sensors` (`sensor_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
