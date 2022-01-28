from SSAposta.Observer import Observer

class Subject:

    def __init__(self):
        self.__observers = []
    
    def notify(self):
        for o in self.__observers:
            o.update()

    def attach(self, o : Observer):
        self.__observers.append(o)

    def detach(self, o : Observer):
        try:
            self.remove(o)
        except:
            print("Objeto não estava na lista")