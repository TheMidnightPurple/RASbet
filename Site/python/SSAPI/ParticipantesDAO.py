import mysql.connector

from SSAposta.Equipa import Equipa
from SSAposta.Atleta import Atleta
from DBConexao import connectToDB

class ParticipantesDAO:
    _instance = None

    def __init__(self):
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def putEquipa(self, equipa : Equipa) -> bool:
        
        (connection, cursor) = connectToDB()

        query = ("INSERT INTO participante\n"
                 "    (id, nome, individual, logotipoURL)\n"
                 "    VALUES\n"
                f"     ({equipa.getId()}, '{equipa.getName()}', 0, '{equipa.getLogotipo()}')\n"   # 1 = True & 0 = False
                 "    ON DUPLICATE KEY UPDATE\n"
                 "        id = VALUES(id),\n"
                 "        nome = VALUES(nome),\n"
                 "        individual = VALUES(individual),\n"
                 "        logotipoURL = VALUES(logotipoURL);")

        try:
            cursor.execute(query) 
            connection.commit()
        except Exception as e:
            print(e)
            return False

        return True
    
    def putAtleta(self, atleta : Atleta) -> bool:
        
        (connection, cursor) = connectToDB()

        query = ("INSERT INTO participante\n"
                 "    (id, nome, individual, logotipoURL)\n"
                 "    VALUES\n"
                f"     ({atleta.getId()}, '{atleta.getName()}', 1, '{atleta.getFoto()}')\n"   # 1 = True & 0 = False
                 "    ON DUPLICATE KEY UPDATE\n"
                 "        id = VALUES(id),\n"
                 "        nome = VALUES(nome),\n"
                 "        individual = VALUES(individual),\n"
                 "        logotipoURL = VALUES(logotipoURL);")

        try:
            cursor.execute(query) 
            connection.commit()
        except Exception as e:
            print(e)
            return False

        return True

    def getEquipas(self):
        pass

    def getAtletas(self):
        (connection, cursor) = connectToDB()

        query = ("SELECT * FROM participante\n"
                 "    WHERE individual = 1;")

        try:
            cursor.execute(query) 
            atletas = cursor.fetchall()

            return atletas

        except Exception as e:
            print(e)
            return False

    def primeiraVez() -> bool:
        _, cursor = connectToDB()
        
        query = "SELECT * FROM participante"
        
        cursor.execute(query) 
        
        atletas = cursor.fetchall()

        if len(atletas) < 5:
            return True
        else:
            return False