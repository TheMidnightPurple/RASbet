
class Equipa:
    
    def __init__(self, id, nome, logo):
        from re import sub
        nome = sub("'",'', nome)
        
        self.__id = int(id)
        self.__name = nome
        self.__logotipo = logo
    
    def getId(self) -> int:
        return self.__id
    
    def getName(self) -> str:
        return self.__name
    
    def getLogotipo(self) -> str:
        return self.__logotipo