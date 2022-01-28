from datetime import datetime 

class Report:
    
    def __init__(self, id = -1, text = '', data = datetime.now()):
        self._data = data
        self._id = id
        self._text = text
    
    def getId(self) -> int:
        return self._id
    
    def getText(self) -> str:
        return self._text
    
    def getData(self) -> datetime:
        return self._data
