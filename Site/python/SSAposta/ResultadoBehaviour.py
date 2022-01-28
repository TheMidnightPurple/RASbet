
class ResultadoBehaviour:
    def getResultado(self):
        pass

class Inacabado(ResultadoBehaviour):
    def __init__(self):
        pass
    
    def getResultado(self):
        return None

# Empate = -1

class Resultado(ResultadoBehaviour):
    def __init__(self, idVencedor = -1):
        self._vencedor = idVencedor
    
    def getResultado(self):
        return self._vencedor

# Cancelado = -2

class Cancelado(ResultadoBehaviour):
    def __init__(self, idVencedor = -2):
        self._vencedor = idVencedor
    
    def getResultado(self):
        return self._vencedor