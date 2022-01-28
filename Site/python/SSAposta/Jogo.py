
from SSAposta.Evento import Evento
from SSAposta.Equipa import Equipa

from SSAposta.ResultadoBehaviour import Inacabado

class Jogo(Evento):
    
    def __init__(self, id, competicao, data, equipaCasa : Equipa, equipaFora : Equipa, resultado = Inacabado(), odds = [0,0,0]):
        super().__init__(id, competicao, data, resultado)

        self.__equipas = []
        self.__equipas.append(equipaCasa)
        self.__equipas.append(equipaFora)

        self._odds = odds
    
    def get_participantes(self) -> list():
        return self.__equipas

    def get_odds(self, equipa = None):
        if equipa and equipa.getId() > 0:
            if self.__equipas[0].getId() == equipa.getId():
                return self._odds[0]
            else:
                return self._odds[2]
        
        return self._odds[1]
    
    def get_all_odds(self):
        return self._odds

    def getDados(self, idParticipante : int):
        dados = {}
        if idParticipante == -1:
            dados['logos'] = list(map(lambda equipa: equipa.getLogotipo(), self.__equipas))
        else:
            if self.__equipas[0].getId() == idParticipante:
                idx = 0
                dados['info'] = 'casa'
            else:
                idx = 1
                dados['info'] = 'fora'
            dados['logos'] = [self.__equipas[idx].getLogotipo()]


        dados['nomes'] = list(map(lambda equipA: equipA.getName(), self.__equipas))

        return dados