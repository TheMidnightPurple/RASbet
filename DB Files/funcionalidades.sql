USE rasbet;

# Eventos / Apostas ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Evento Iniciado

UPDATE Evento AS E
SET E.iniciado = TRUE
WHERE E.id = '69';

# Evento Terminado

UPDATE Evento AS E
SET E.iniciado = FALSE, E.terminado = TRUE, E.vencedor = 123
WHERE E.id = '69';

# Get Apostas do Evento

SELECT * FROM Aposta AS A
WHERE A.idEvento = '69';

# Get Apostas Encerradas

SELECT * FROM Aposta AS A
INNER JOIN Evento AS E ON A.idEvento = E.id
WHERE A.idUtilizador = 1 AND (E.iniciado = TRUE OR E.terminado = TRUE);

# Saldo Moeda ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Select saldo

SELECT * FROM CarteiraMoeda AS CM
WHERE CM.idUtilizador = 1;

# Select saldos

SELECT idMoeda, quantidade FROM CarteiraMoeda AS CM
WHERE CM.idUtilizador = 1;

# Update saldo

UPDATE CarteiraMoeda AS CM
SET CM.quantidade = 1000
WHERE CM.idUtilizador = 1 AND CM.idMoeda = 'Dolar';