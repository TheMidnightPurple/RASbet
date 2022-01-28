from datetime import datetime
from SSReport.Report import Report
from DBConexao import connectToDB

class ReportDAO:
    _instance = None

    def __init__(self):
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def put(self, report : Report) -> bool:
        connection, cursor = connectToDB()
        
        if report.getId() < 0:
            query = """ 
                        INSERT INTO Problema 
                        (problema, data)
                            VALUES ('%s', '%s');
                    """ % (report.getText(), report.getData().strftime("%Y-%m-%d %H:%M") )

            try:
                cursor.execute(query)
                connection.commit()
            except:
                print(query)
                return False

            return True
        else:
            query = """ 
                        UPDATE Problema SET  
                            problema = %s, 
                            data = %s
                                WHERE id = %s;
                    """ % (report.getText(), report.getData().strftime("%Y-%m-%d %H:%M"), report.getId())

            try:
                cursor.execute(query)
                connection.commit()
            except:
                return False

            return True

    def get(self, id : int) -> Report:
        connection, cursor = connectToDB()

        query = """ 
                    SELECT id, problema, data FROM Problema
                        WHERE id = %s;
                """ % str(id)

        try:
            cursor.execute(query)
        except:
            return None

        r = cursor.fetchone()

        return Report(int(r[0]), r[1], datetime.fromisoformat(str(r[2])))
    
    def getAll(self) -> list():
        _, cursor = connectToDB()

        try:
            cursor.execute("SELECT id, problema, data FROM Problema order by data desc;")
        except:
            return []

        lista = cursor.fetchall()
        
        temp = []
        for r in lista:
            temp.append( Report(int(r[0]), r[1], datetime.fromisoformat(str(r[2]))) )
        
        return temp