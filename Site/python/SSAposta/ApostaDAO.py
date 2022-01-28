from SSAposta.Aposta import Aposta
from DBConexao import connectToDB

from SSAposta.Evento import Evento
from SSUtilizador.Carteira import Moeda

class ApostaDAO:
    _instance = None

    def __init__(self):
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def putAposta(self, aposta : Aposta) -> bool:

        connection, cursor = connectToDB()

        idEv = aposta.getEvento().get_id_evento()
        idUt = aposta.getIDUtilizador()
        tipo_moeda = aposta.getMoeda().get_tipo()
        montante = aposta.getMoeda().get_saldo()
        odd = aposta.getOdd()
        idVencedor = aposta.getIDParticipante()

        query = """ 
                INSERT INTO aposta (idEvento, idUtilizador, idMoeda, quantiaApostada, odd, vencedorApostado)
                VALUES (%s, %s, '%s', %s, %s, %s);
            """%(idEv, idUt, tipo_moeda, montante, odd, idVencedor)

        cursor.execute(query)
        connection.commit()
        
        return True
    
    def getAposta(self, idAposta : int) -> Aposta:
        pass

    def getApostasEvento(self, evento : Evento) -> list():
        _, cursor = connectToDB()

        query = """ 
                    SELECT idUtilizador, idMoeda, quantiaApostada, odd, vencedorApostado FROM Aposta AS A
                    INNER JOIN Evento AS E ON A.idEvento = E.id
                    WHERE E.id = %s;
                """ % str(evento.get_id_evento())

        cursor.execute(query)

        apostas = []

        for r in cursor:
            idUser = int(r[0])
            idEquipa = int(r[4]) if r[4] != None else -1
            moeda = Moeda.instance(r[1], float(r[2]))
            odd = float(r[3])
            aposta = Aposta(idUser, idEquipa, moeda, evento, odd)
            apostas.append(aposta)

        return apostas

    # TODO este metodo esta mal
    def getALLAposta(self, idUtilizador : int) -> list():
        _, cursor = connectToDB()

        query = """ 
                    SELECT vencedorApostado, idMoeda, quantiaApostada, odd, idEvento FROM Aposta AS A
                    INNER JOIN Evento AS E ON A.idEvento = E.id
                    WHERE A.idUtilizador = %s
                    order by A.id desc;
                """ % str(idUtilizador)

        cursor.execute(query)

        apostas = []

        from SSAposta.EventoDAO import EventoDAO
        for r in cursor:
            eventoDAO = EventoDAO.instance()
            evento = eventoDAO.getEvento(int(r[4]))
            


            aposta = Aposta(id, int(r[0]), Moeda.instance(r[1],float(r[2])), evento, float(r[3]))
            apostas.append(aposta)

        return apostas