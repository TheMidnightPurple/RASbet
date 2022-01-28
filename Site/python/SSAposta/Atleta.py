
class Atleta:
    
    def __init__(self, id, nome, foto):
        from re import sub
        nome = sub("'",'', nome)
        
        self.__id = id
        self.__name = nome
        self.__foto = foto
    
    def getId(self) -> int:
        return self.__id
    
    def getName(self) -> str:
        return self.__name
    
    def getFoto(self) -> str:
        return self.__foto