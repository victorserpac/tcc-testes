-- -----------------------------------------------------
-- Schema tcc_testes_api_rest
-- -----------------------------------------------------
DROP DATABASE IF EXISTS `tcc_testes_api_rest`;
CREATE SCHEMA IF NOT EXISTS `tcc_testes_api_rest` DEFAULT CHARACTER SET utf8;
USE `tcc_testes_api_rest` ;

-- -----------------------------------------------------
-- Table `tcc_testes_api_rest`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcc_testes_api_rest`.`aluno` (
  `matricula` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `curso` VARCHAR(45) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`matricula`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tcc_testes_api_rest`.`midia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcc_testes_api_rest`.`midia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NULL,
  `capa` VARCHAR(200) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tcc_testes_api_rest`.`filme`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcc_testes_api_rest`.`filme` (
  `midia_id` INT NOT NULL,
  `sinopse` TEXT NULL,
  `diretor` VARCHAR(45) NULL,
  `duracao` VARCHAR(45) NULL,
  PRIMARY KEY (`midia_id`),
  FOREIGN KEY (`midia_id`) REFERENCES `tcc_testes_api_rest`.`midia` (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tcc_testes_api_rest`.`livro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcc_testes_api_rest`.`livro` (
  `midia_id` INT NOT NULL,
  `autor` VARCHAR(45) NULL,
  `editora` VARCHAR(45) NULL,
  PRIMARY KEY (`midia_id`),
  FOREIGN KEY (`midia_id`) REFERENCES `tcc_testes_api_rest`.`midia` (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tcc_testes_api_rest`.`aluguel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcc_testes_api_rest`.`aluguel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `midia_id` INT NOT NULL,
  `aluno_matricula` BIGINT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`midia_id`) REFERENCES `tcc_testes_api_rest`.`midia` (`id`),
  FOREIGN KEY (`aluno_matricula`) REFERENCES `tcc_testes_api_rest`.`aluno` (`matricula`)
)
ENGINE = InnoDB;