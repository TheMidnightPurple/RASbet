from datetime import datetime
from SSAposta.ApostaDAO import ApostaDAO
from SSAposta.EventoDAO import EventoDAO
from SSAposta.Aposta import Aposta
from SSUtilizador.UtilizadorDAO import UtilizadorDAO
from SSUtilizador.Carteira import Carteira 

class SSApostaFacade:

    def __init__(self):
        self.__eventos = EventoDAO.instance()
        self.__apostas = ApostaDAO.instance() 

    def getEventosDisponiveis(self, tipo : int, limit : int, data = datetime.now()) -> list():
        return self.__eventos.getAllEvento(tipo,limit,data)

    def _registarApostas(self, boletim : list()):
        for aposta in boletim:
            self.__apostas.putAposta(aposta)

    def confirmar_boletim_apostas(self, boletim : list(), user : int) -> bool:
        
        res = False

        if(boletim):
            
            utilizadorDAO = UtilizadorDAO.instance()
            utilizador = utilizadorDAO.get_utilizador_id(user)
            carteira = utilizador.get_carteira()

            carteiraTemporaria = Carteira()
            for aposta in boletim:
                moeda = aposta.getMoeda()
                carteiraTemporaria.add_saldo(moeda.get_tipo(), moeda.get_saldo())

            temDinheiro = carteira.validaCarteira(carteiraTemporaria)


            if(temDinheiro):
                utilizador.retirarDinheiro(carteiraTemporaria)
                utilizadorDAO.put(utilizador)
                self._registarApostas(boletim)
                res = True

        return res

    def setEventoFinalizado(self, evento : int, id_vencedor : int) -> bool:
        e = self.__eventos.getEvento(evento)
        if not e:
            return False
            
        tinhaResultado = e.getResultado()

        if tinhaResultado is None or tinhaResultado == -2:
            e.setResultado(id_vencedor)
            self.__eventos.putEvento(e)
            e.notify()
            return True
        
        return False

    def get_historico(self, user : int) -> list():
        return self.__apostas.getALLAposta(user)
    