from SSAPI.Taxas import Taxas

class Moeda:
    @classmethod
    def instance(cls, tipo : str, montante = 0.0):
        carteira = Carteira()
        moeda = carteira.get_moeda(tipo)
        moeda.add_saldo(montante)
        return moeda

    def __init__(self, taxa = 1.00, tipo=None, saldo = 0.00):
        self._taxa = taxa
        self._saldo = saldo
        self._tipo = tipo

    def get_saldo(self) -> float:
        return self._saldo

    def add_saldo(self, valor : float):
        self._saldo += valor

    def remove_saldo(self, valor : float):
        self._saldo -= valor

    def converteParaEuro(self, valor : float) -> float:
        if self._saldo >= valor:
            return valor * 1/self._taxa
        else:
            return None

    def converteDeEuro(self, valor : float):
        self._saldo += valor * self._taxa

    def get_tipo(self):
        return self._tipo

    def __ge__(self, other):
        return self._saldo >= other.get_saldo()


class Euro(Moeda):
    def __init__(self, tipo = '€', saldo=0):
        super().__init__(taxa=1, tipo=tipo, saldo=saldo)

class Dolar(Moeda):
    def __init__(self, tipo = '$', saldo=0):
        taxa = Taxas.USD
        super().__init__(taxa=taxa, tipo=tipo, saldo=saldo)

class LibraInglesa(Moeda):
    def __init__(self, tipo = '£',  saldo=0):
        taxa = Taxas.GBP
        super().__init__(taxa=taxa, tipo=tipo, saldo=saldo)

class Cardano(Moeda):
    def __init__(self, tipo = 'ADA', saldo=0):
        taxa = Taxas.CAD
        super().__init__(taxa=taxa, tipo=tipo, saldo=saldo)


class Carteira:
    def __init__(self):
        #Adicionar aqui sempre que se criar uma nova moeda
        self._moedas = {'€': Euro(), '$': Dolar(), 'ADA': Cardano(), '£': LibraInglesa()}

    def get_saldo(self, tipo_moeda : str) -> float:
        return self._moedas[tipo_moeda].get_saldo()

    def add_saldo(self, tipo_moeda : str, valor : float):
        self._moedas[tipo_moeda].add_saldo(valor)

    def add_saldo_Moeda(self, moeda : Moeda):
        self._moedas[moeda.get_tipo()].add_saldo(moeda.get_saldo())

    def remove_saldo(self, tipo_moeda : str, valor : float):
        self._moedas[tipo_moeda].remove_saldo(valor)

    def converte(self, tipo_in : str, tipo_out : str, valor : float) -> bool:
        saldo = self.moedas[tipo_in].converteParaEuro(valor)
        if saldo:
            self.moedas[tipo_out].converteDeEuro(saldo)
        return saldo != None

    def get_moeda(self, tipo) -> Moeda:
        return self._moedas[tipo]

    def validaCarteira(self, carteira) -> bool:
        res = True
        for moeda in self._moedas.values():
            res = res and moeda >= carteira._moedas[moeda.get_tipo()]
        return res

    def retirarDinheiro(self, carteira):
        for moeda in self._moedas.values():
            tipo_moeda = moeda.get_tipo()
            despesa = carteira.get_saldo(tipo_moeda)
            self.remove_saldo(tipo_moeda, despesa)
        
    
    def adicionarDinheiro(self, carteira):
        for moeda in self._moedas.values():
            tipo_moeda = moeda.get_tipo()
            saldo = carteira.get_saldo(tipo_moeda)
            self.add_saldo(tipo_moeda, saldo)
    
    def map_moeda(self, func):
        for moeda in self._moedas.values():
            func(moeda)

