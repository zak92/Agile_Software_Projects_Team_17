-- setup new user
CREATE USER 'test'@'localhost' IDENTIFIED BY 'newpassword';

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema coding_knowledge_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema coding_knowledge_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `coding_knowledge_db` DEFAULT CHARACTER SET UTF8MB4 ;
USE `coding_knowledge_db` ;

-- -----------------------------------------------------
-- Table `coding_knowledge_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coding_knowledge_db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `user_email` VARCHAR(50) NOT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  `is_admin` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  UNIQUE INDEX `user_password_UNIQUE` (`user_password` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coding_knowledge_db`.`tools`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coding_knowledge_db`.`tools` (
  `tool_id` INT NOT NULL AUTO_INCREMENT,
  `fk_user_id` INT NOT NULL,
  `tool` VARCHAR(50) NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `description` MEDIUMTEXT NULL,
  `code_snippet` MEDIUMTEXT NOT NULL,
  `tags` VARCHAR(255) NULL,
  `upvotes` INT NOT NULL DEFAULT '0',
  `flagged` TINYINT NOT NULL DEFAULT '0',
  `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tool_id`),
  INDEX `fk_t_user_id_idx` (`fk_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_t_user_id`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `coding_knowledge_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coding_knowledge_db`.`languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coding_knowledge_db`.`languages` (
  `language_id` INT NOT NULL AUTO_INCREMENT,
  `fk_user_id` INT NOT NULL,
  `language` VARCHAR(50) NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `description` MEDIUMTEXT NULL,
  `code_snippet` MEDIUMTEXT NOT NULL,
  `tags` VARCHAR(255) NULL,
  `upvotes` INT NOT NULL DEFAULT '0',
  `flagged` TINYINT NOT NULL DEFAULT '0',
  `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`language_id`),
  INDEX `fk_user_id_idx` (`fk_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_l_user_id`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `coding_knowledge_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coding_knowledge_db`.`frameworks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coding_knowledge_db`.`frameworks` (
  `framework_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fk_user_id` INT NOT NULL,
  `framework` VARCHAR(50) NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `description` MEDIUMTEXT NULL,
  `code_snippet` MEDIUMTEXT NOT NULL,
  `tags` VARCHAR(255) NULL,
  `upvotes` INT NOT NULL DEFAULT '0',
  `flagged` TINYINT NOT NULL DEFAULT '0',
  `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`framework_id`),
  INDEX `fk_user_id_idx` (`fk_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_f_user_id`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `coding_knowledge_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
