USE rasbet;

# Utilizador ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

SELECT * FROM Utilizador;
DELETE FROM Utilizador WHERE TRUE;

# Insert Apostador ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Utilizador (nomeUtilizador, email, password, nomeCompleto)
VALUES ('brunopj', 'brunopj1@hotmail.com', '12345', 'Bruno Pinto Jacome');
INSERT INTO Apostador (id, morada, telemovel, cartaoCidadao)
VALUES (LAST_INSERT_ID(), 'Rua do Bruno', '935566446', '516273816');

SELECT * FROM Apostador;
DELETE FROM Apostador WHERE TRUE;

# Gestor ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Utilizador (nomeUtilizador, email, password, nomeCompleto)
VALUES ('brunopj', 'brunopj1@hotmail.com', '12345', 'Bruno Pinto Jacome');
INSERT INTO Gestor (id)
VALUES (LAST_INSERT_ID());

SELECT * FROM Gestor;
DELETE FROM Gestor WHERE TRUE;

# Moeda ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Moeda (id, conversaoParaEuro, conversaoDeEuro)
VALUES ('Euro', 1, 1), ('Dolar', 1.3, 0.7);

SELECT * FROM Moeda;
DELETE FROM Moeda WHERE TRUE;

# CarteiraMoeda ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO CarteiraMoeda (idUtilizador, idMoeda, quantidade)
VALUES (1, 'Euro', 10);

SELECT * FROM CarteiraMoeda;
DELETE FROM CarteiraMoeda WHERE TRUE;

# Participante ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Participante (id, nome, individual, logotipoURL)
VALUES (123,  'Bruno Bruno Ola', FALSE, 'www.youtube.com'),
	   (321, 'Adriano Foda-se', TRUE, 'www.gay.pt');

SELECT * FROM Participante;
DELETE FROM Participante WHERE TRUE;

# Evento ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Evento (id, nome, individual, iniciado, terminado, vencedor)
VALUES (69, 'Saltar a corda', TRUE, FALSE, FALSE, NULL);
INSERT INTO ParticipanteEvento (idEvento, idParticipante, odd)
VALUES (69, 123, 1.12),
       (69, 321, 100.99);

SELECT * FROM Evento;
DELETE FROM Evento WHERE TRUE;

SELECT * FROM ParticipanteEvento;
DELETE FROM ParticipanteEvento WHERE TRUE;

# Aposta ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Aposta (idEvento, idUtilizador, idMoeda, quantiaApostada, odd, vencedorApostado)
VALUES (69, 1, 'Euro', 10, 19.12, 123);

SELECT * FROM Aposta;
DELETE FROM Aposta WHERE TRUE;

# Problema ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO Problema (idUtilizador, problema, data)
VALUES (1, 'Ola eu sou o Bruno', NOW());

SELECT * FROM Problema;
DELETE FROM Problema WHERE TRUE;
