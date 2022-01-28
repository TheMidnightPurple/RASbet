from SSAposta.ResultadoBehaviour import Cancelado, Inacabado, Resultado
from SSAposta.Subject import Subject

from datetime import datetime

class Evento(Subject):

    def __init__(self, id, competicao, data, resultado = Inacabado()):
        super().__init__()
        self.__idEvento = id
        self.__competicao = competicao
        self.__data = data
        self.__resultado = resultado

    def get_id_evento(self) -> int:
        return self.__idEvento
    
    def get_data_evento(self) -> datetime:
        return self.__data
    
    def get_competicao_evento(self) -> str:
        return self.__competicao

    def getResultado(self) -> int:
        return self.__resultado.getResultado()
    
    def setResultado(self, idVencedor) -> int:
        self.__resultado = Resultado(idVencedor=idVencedor)
    
    def setCancelado(self) -> int:
        self.__resultado = Cancelado()

    def get_odds(self, participante):
        return 0

    def getDados(self, idParticipante):
        pass
