from SSUtilizador.Carteira import Carteira
from SSUtilizador.Carteira import Moeda


class Utilizador:

    def __init__(self, id : int, name : str, email : str, password : str):
        self._id = id
        self._name = name
        self._email = email
        self._password = password

    def get_id(self) -> int:
        return self._id

    def get_name(self) -> str:
        return self._name
    
    def get_email(self) -> str:
        return self._email

    def set_email(self, email : str):
        self._email = email

    def get_password(self) -> str:
        return self._password

    def set_password(self, password : str):
        self._password = password

class Apostador(Utilizador):
    def __init__(self, id : int , name : str, email : str , password : str, carteira : Carteira, morada : str, telemovel : str, cc : str):
        super().__init__(id, name, email, password)
        self._carteira = carteira
        self._morada = morada
        self._telemovel = telemovel
        self._cc = cc

    def get_carteira(self) -> Carteira:
        return self._carteira
    
    def get_morada(self) -> str:
        return self._morada

    def set_morada(self, morada : str):
        self._morada = morada

    def get_telemovel(self) -> str:
        return self._telemovel

    def set_telemovel(self, telemovel : str):
        self._telemovel = telemovel

    def get_cc(self) -> str:
        return self._cc

    def retirarDinheiro(self, carteira: Carteira):
        self._carteira.retirarDinheiro(carteira)
    
    def retirarDinheiroMoeda(self, moeda: Moeda):
        self._carteira.remove_saldo(moeda.get_tipo(),moeda.get_saldo())
    
    def adicionarDinheiro(self, carteira: Carteira):
        self._carteira.adicionarDinheiro(carteira)
    
    def adicionarDinheiroMoeda(self, moeda: Moeda):
        self._carteira.add_saldo(moeda.get_tipo(),moeda.get_saldo())


class Gestor(Utilizador):
    def __init__(self, id : int, name : str, email : str, password : str):
        super().__init__(id, name, email, password)

