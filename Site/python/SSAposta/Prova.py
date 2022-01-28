from datetime import datetime
from SSAposta.Evento import Evento
from SSAposta.ResultadoBehaviour import Inacabado
from SSAposta.Atleta import Atleta

class Prova(Evento):

    def __init__(self, id, competicao, data, atletas, resultado=Inacabado(), odds=[]):
        super().__init__(id, competicao, data, resultado)
        self.__atletas = atletas
        self._odds=odds

    def get_participantes(self) -> list():
        return self.__atletas

    def getDados(self, idParticipante : int):
        dados = {}
        atleta = [x for x in self.__atletas if x.getId() == idParticipante]
        dados['logos'] = [atleta[0].getFoto()]
        dados['nomes'] = [atleta[0].getName()]
        dados['nomeProva'] = self.get_competicao_evento()

        return dados
    
    def get_odds(self, atleta : Atleta):
        return [x[1] for x in zip(self.__atletas,self._odds) if x[0].getId() == atleta.getId()][0]

    def get_all_odds(self):
        return self._odds
