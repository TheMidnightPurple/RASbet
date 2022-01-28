
from SSAposta.Evento import Evento
from SSAposta.Prova import Prova
from SSAposta.Jogo import Jogo

from DBConexao import connectToDB
from datetime import datetime

from SSAposta.Atleta import Atleta
from SSAposta.Equipa import Equipa
from SSAposta.ResultadoBehaviour import Inacabado, Resultado

class EventoDAO:
    _instance = None

    def __init__(self):
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def getEvento(self, id : int):
        evento = None

        _, cursor = connectToDB()

        query = """ 
                SELECT id, nome, individual, iniciado, terminado, vencedor, data FROM evento
                    WHERE id = %s;
            """ % (str(id))
        
        cursor.execute(query)
        
        r = cursor.fetchone()
        if r is None:
            return None
        # Criar Resultado
        resultado = Inacabado() if r[4] == 0 else Resultado(r[5])

        # Individual
        if(int(r[2]) == 1):
            
            query = """ 
                SELECT pe.idParticipante, nome, logotipoURL, odd FROM participanteevento as pe
	                JOIN participante as a ON pe.idParticipante = a.id
		                WHERE pe.idEvento = %s AND pe.idParticipante >= 0;
            """ % (str(id))

            cursor.execute(query)

            atletas = []
            odds = []
            for atl in cursor:
                a = Atleta(int(atl[0]),atl[1],atl[2])
                atletas.append(a)
                odds.append(atl[3])
            
            evento = Prova(int(r[0]), r[1], datetime.fromisoformat(str(r[6])), atletas, resultado, odds) 
        # Coletivo
        else:

            query = """ 
                SELECT pe.idParticipante, nome, logotipoURL, pe.controlo, pe.odd FROM participanteevento as pe
	                JOIN participante as p ON pe.idParticipante = p.id
		                WHERE pe.idEvento = %s
                        order by pe.controlo asc;
            """ % (str(id))

            cursor.execute(query)
            r1 = cursor.fetchall()

            e1 = Equipa(int(r1[0][0]),r1[0][1],r1[0][2])
            e2 = Equipa(int(r1[1][0]),r1[1][1],r1[1][2])
            odds = [float(r1[0][4]), float(r1[2][4]), float(r1[1][4])]

            evento = Jogo(int(r[0]), r[1], datetime.fromisoformat(str(r[6])), e1, e2, resultado, odds)
            
        # Get Apostas do Evento
        from SSAposta.ApostaDAO import ApostaDAO
        apostas = ApostaDAO.instance().getApostasEvento(evento)
        for aposta in apostas:
            evento.attach(aposta)

        return evento


    def putEvento(self, evento : Evento):
        
        individual = 0
        if(isinstance(evento, Prova)):
            individual = 1
        
        (connection, cursor) = connectToDB()
        
        terminado = 0 if (evento.getResultado() is None) else 1
        comecado = 0 if (evento.get_data_evento() > datetime.now()) else 1 
        vencedor = 'NULL' if (evento.getResultado() is None) else evento.getResultado()

        id_evento = evento.get_id_evento()
        query = ("INSERT INTO evento\n"
                 "    (id, nome, individual, iniciado, terminado, vencedor, data)\n"
                 "    VALUES\n"
                f"     ({id_evento}, '{evento.get_competicao_evento()}', {individual}, {comecado}, {terminado}, {vencedor}, '{evento.get_data_evento()}')\n"   # 1 = True & 0 = False
                 "    ON DUPLICATE KEY UPDATE\n"
                 "        id = VALUES(id),\n"
                 "        nome = VALUES(nome),\n"
                 "        individual = VALUES(individual),\n"
                 "        iniciado = VALUES(iniciado),\n"
                 "        terminado = VALUES(terminado),\n"
                 "        vencedor = VALUES(vencedor);")
        
        try:
            cursor.execute(query) 
            connection.commit()
        except Exception as e:
            print('1', e)
            return False
        
        temp = []
        if(individual == 0):
            # é um jogo
            jogo : Jogo = evento
            temp = jogo.get_participantes()
            temp.append(Equipa(-1,'Empate',''))
        else:
            # é uma prova
            prova : Prova = evento
            temp = prova.get_participantes()

        i = 0
        for participante in temp:
            id = participante.getId()

            query = ("INSERT INTO participanteevento\n"
                "    (idEvento, idParticipante, odd, controlo)\n"
                "    VALUES\n"
               f"     ({id_evento}, {id}, {evento.get_odds(participante)}, {i})\n"   # 1 = True & 0 = False
                "    ON DUPLICATE KEY UPDATE\n"
                "        idEvento = VALUES(idEvento),\n"
                "        idParticipante = VALUES(idParticipante),\n"
                "        odd = VALUES(odd);")

            try:
                cursor.execute(query) 
                connection.commit()
            except Exception as e:
                print('2', e)
                return False
            
            i += 1

        return True
    
    def addResultadoEvento(self, id_evento : int, id_vencedor : int):
        
        (connection, cursor) = connectToDB()
        
        query = (f"UPDATE evento SET vencedor = {id_evento} \n"
                 f"    WHERE id = {id_vencedor};")
        
        if(id_vencedor < 0):
            query = (f"UPDATE evento SET vencedor = NULL \n"
                     f"    WHERE id = {id_vencedor};")

        try:
            cursor.execute(query) 
            connection.commit()
        except Exception as e:
            print(e)
            return False
    
    def getAllEvento(self, tipo : int, limit : int, desde : datetime):

        evento = None

        _, cursor = connectToDB()

        query = """ 
                SELECT id, nome, individual, iniciado, terminado, vencedor, data FROM evento
                    where individual = %s and data > '%s'
	                order by data asc
                    limit %s;
            """ % (str(tipo), desde.strftime("%Y-%m-%d %H:%M"), str(limit))

        cursor.execute(query)
        lista = cursor.fetchall()
        
        temp = []
        for r in lista:

            # Criar Resultado
            resultado = Inacabado() if r[4] == 0 else Resultado(r[5])
            
            # Individual
            if(int(r[2]) == 1):
                
                query = """ 
                    SELECT pe.idParticipante, nome, logotipoURL, odd FROM participanteevento as pe
                        JOIN participante as a ON pe.idParticipante = a.id
                            WHERE pe.idEvento = %s AND pe.idParticipante >= 0;
                """ % (str(r[0]))

                cursor.execute(query)

                atletas = []
                odds = []
                for atl in cursor:
                    a = Atleta(int(atl[0]),atl[1],atl[2])
                    atletas.append(a)
                    odds.append(atl[3])

                evento = Prova(int(r[0]), r[1], datetime.fromisoformat(str(r[6])), atletas, resultado, odds=odds)
            
            # Coletivo
            else:

                query = """ 
                    SELECT pe.idParticipante, nome, logotipoURL, controlo, odd FROM participanteevento as pe
                        JOIN participante as a ON pe.idParticipante = a.id
                            WHERE pe.idEvento = %s
                            order by pe.controlo asc;
                """ % (str(r[0]))

                cursor.execute(query)
                r1 = cursor.fetchall()
                
                e1 = Equipa(int(r1[0][0]),r1[0][1],r1[0][2])
                e2 = Equipa(int(r1[1][0]),r1[1][1],r1[1][2])
                odds = [float(r1[0][4]), float(r1[2][4]), float(r1[1][4])]
                
                evento = Jogo(int(r[0]), r[1], datetime.fromisoformat(str(r[6])), e1, e2, resultado, odds)

            # Get Apostas do Evento
            from SSAposta.ApostaDAO import ApostaDAO
            apostas = ApostaDAO.instance().getApostasEvento(evento)
            for aposta in apostas:
                evento.attach(aposta)     
            temp.append(evento)       

        return temp