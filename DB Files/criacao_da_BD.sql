-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema RASBet
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema RASBet
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `RASBet` DEFAULT CHARACTER SET utf8 ;
USE `RASBet` ;

-- -----------------------------------------------------
-- Table `RASBet`.`Utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Utilizador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nomeUtilizador` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `nomeCompleto` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nomeUtilizador_UNIQUE` (`nomeUtilizador` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`Apostador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Apostador` (
  `id` INT NOT NULL,
  `morada` VARCHAR(100) NOT NULL,
  `telemovel` VARCHAR(20) NULL,
  `cartaoCidadao` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Apostador_Utilizador1_idx` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_Apostador_Utilizador1`
    FOREIGN KEY (`id`)
    REFERENCES `RASBet`.`Utilizador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`Moeda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Moeda` (
  `id` VARCHAR(50) NOT NULL,
  `conversaoParaEuro` DECIMAL(5,2) NOT NULL,
  `conversaoDeEuro` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`CarteiraMoeda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`CarteiraMoeda` (
  `idUtilizador` INT NOT NULL,
  `idMoeda` VARCHAR(50) NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idUtilizador`, `idMoeda`),
  INDEX `fk_Carteira_Moeda_Moeda1_idx` (`idMoeda` ASC) VISIBLE,
  INDEX `fk_CarteiraMoeda_Apostador1_idx` (`idUtilizador` ASC) VISIBLE,
  CONSTRAINT `fk_Carteira_Moeda_Moeda1`
    FOREIGN KEY (`idMoeda`)
    REFERENCES `RASBet`.`Moeda` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CarteiraMoeda_Apostador1`
    FOREIGN KEY (`idUtilizador`)
    REFERENCES `RASBet`.`Apostador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`Gestor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Gestor` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Gestor_Utilizador1`
    FOREIGN KEY (`id`)
    REFERENCES `RASBet`.`Utilizador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`Participante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Participante` (
  `id` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `individual` TINYINT NOT NULL,
  `logotipoURL` VARCHAR(300) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`Evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Evento` (
  `id` INT NOT NULL,
  `nome` VARCHAR(50) NULL,
  `individual` TINYINT NOT NULL,
  `iniciado` TINYINT NOT NULL,
  `terminado` TINYINT NOT NULL,
  `vencedor` INT NULL,
  `data` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Evento_Participante1_idx` (`vencedor` ASC) VISIBLE,
  CONSTRAINT `fk_Evento_Participante1`
    FOREIGN KEY (`vencedor`)
    REFERENCES `RASBet`.`Participante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `RASBet`.`Aposta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Aposta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idEvento` INT NOT NULL,
  `idUtilizador` INT NOT NULL,
  `idMoeda` VARCHAR(50) NOT NULL,
  `quantiaApostada` DECIMAL(10,2) NOT NULL,
  `odd` DECIMAL(5,2) NOT NULL,
  `vencedorApostado` INT NOT NULL,
  PRIMARY KEY (`id`, `idEvento`, `idUtilizador`, `idMoeda`),
  INDEX `fk_Aposta_Moeda1_idx` (`idMoeda` ASC) VISIBLE,
  INDEX `fk_Aposta_Evento1_idx` (`idEvento` ASC) VISIBLE,
  INDEX `fk_Aposta_Participante1_idx` (`vencedorApostado` ASC) VISIBLE,
  INDEX `fk_Aposta_Apostador1_idx` (`idUtilizador` ASC) VISIBLE,
  CONSTRAINT `fk_Aposta_Moeda1`
    FOREIGN KEY (`idMoeda`)
    REFERENCES `RASBet`.`Moeda` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Aposta_Evento1`
    FOREIGN KEY (`idEvento`)
    REFERENCES `RASBet`.`Evento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Aposta_Participante1`
    FOREIGN KEY (`vencedorApostado`)
    REFERENCES `RASBet`.`Participante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Aposta_Apostador1`
    FOREIGN KEY (`idUtilizador`)
    REFERENCES `RASBet`.`Apostador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RASBet`.`ParticipanteEvento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`ParticipanteEvento` (
  `idEvento` INT NOT NULL,
  `idParticipante` INT NOT NULL,
  `odd` DECIMAL(5,2) NOT NULL,
  `controlo` INT NOT NULL,
  PRIMARY KEY (`idEvento`, `idParticipante`),
  INDEX `fk_Evento_has_Participante_Participante1_idx` (`idParticipante` ASC) VISIBLE,
  INDEX `fk_Evento_has_Participante_Evento1_idx` (`idEvento` ASC) VISIBLE,
  CONSTRAINT `fk_Evento_has_Participante_Evento1`
    FOREIGN KEY (`idEvento`)
    REFERENCES `RASBet`.`Evento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Evento_has_Participante_Participante1`
    FOREIGN KEY (`idParticipante`)
    REFERENCES `RASBet`.`Participante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `RASBet`.`Problema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RASBet`.`Problema` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `problema` VARCHAR(300) NOT NULL,
  `data` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO Moeda (id, conversaoParaEuro, conversaoDeEuro)
    VALUES 
    ('€', 1, 1),
    ('$', 1.3, 0.7),
    ('£', 1.2, 0.8),
    ('ADA', 1.1, 0.9);

INSERT INTO PARTICIPANTE (id, nome, individual, logotipoURL)
	VALUES (-1, 'Empate', 0, ''), (-2, 'Cancelado', 0, '');    

INSERT INTO Utilizador (nomeUtilizador, email, password, nomeCompleto)
		VALUES ('GestorRASBET', 'gestor@mail.pt','Gestor1234','');

INSERT INTO gestor (id)
	values (1);

CREATE USER 'rasbet' IDENTIFIED BY 'rasbet';
GRANT ALL PRIVILEGES ON rasbet.* TO 'rasbet';