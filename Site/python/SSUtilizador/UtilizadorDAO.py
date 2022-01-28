from bottle import ERROR_PAGE_TEMPLATE
from mysql.connector import connection
from DBConexao import connectToDB
from SSUtilizador.Carteira import Carteira, Moeda
from SSUtilizador.Utilizador import Apostador, Gestor, Utilizador

class UtilizadorDAO:
    
    _instance = None

    def __init__(self):
        self._key = 'RasBEt2022.abc123456789@#%&e![€?]hlnvjshdkvopsçhbcvkaçadvlRSHIORH+IOGRGAR8PEWFUI EWM0+MN+*-'
    
    def _encode(self, string):
        encoded_chars = []
        for i in range(len(string)):
            key_c = self._key[i % len(self._key)]
            encoded_c = chr(ord(string[i]) + ord(key_c) % 256)
            encoded_chars.append(encoded_c)
        return "".join(encoded_chars)

    def _decode(self, string):
        encoded_chars = []
        for i in range(len(string)):
            key_c = self._key[i % len(self._key)]
            encoded_c = chr(ord(string[i]) - ord(key_c) % 256)
            encoded_chars.append(encoded_c)
        return "".join(encoded_chars)

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def put(self, apostador: Apostador) -> int:
        
        connection, cursor = connectToDB()
        if apostador.get_id() == -1:
            query = """ 
                        INSERT INTO Utilizador (nomeUtilizador, email, password, nomeCompleto)
                        VALUES (%s, %s, %s, %s);
                    """

            values = (apostador.get_name(), apostador.get_email(), self._encode(apostador.get_password()), '')

            try:
                cursor.execute(query, values)
                connection.commit()
            except:
                print(query)
                return -1

            query = """ 
                        INSERT INTO Apostador (id, morada, telemovel, cartaoCidadao)
                        VALUES (%s, %s, %s, %s);
                    """

            idNovo = str(cursor.lastrowid)
            
            values = (idNovo, self._encode(apostador.get_morada()), self._encode(apostador.get_telemovel()), self._encode(apostador.get_cc()))

            try:
                cursor.execute(query, values)
                connection.commit()
            except:
                print(query)
                return -1

            query = """ 
                        INSERT INTO carteiramoeda 
                        (idUtilizador, idMoeda, quantidade)
                            VALUES 
                            (%s, '€', 0),
                            (%s, '$', 0),
                            (%s, '£', 0),
                            (%s, 'ADA', 0);
                    """
            
            values = (idNovo,idNovo,idNovo,idNovo)

            try:
                cursor.execute(query, values)
                connection.commit()
            except:
                print(query)
                return -1

            return idNovo
        else:
            return self._update_user(apostador)
    
    
    def _update_user(self, apostador: Apostador) -> int:

        connection, cursor = connectToDB()
        query = """ 
                        UPDATE Utilizador SET
                            nomeUtilizador = %s, 
                            email = %s, 
                            password = %s,
                            nomeCompleto = %s
                        WHERE id = %s;
                    """
        values = (apostador.get_name(), apostador.get_email(), self._encode(apostador.get_password()), '', apostador.get_id())

        res = self._update_carteira(apostador.get_carteira(), apostador.get_id())

        if not res:
            return -1

        try:
            cursor.execute(query,values)
            connection.commit()
        except:
            return -1

        query = """ 
                UPDATE Apostador SET
                    morada = %s, 
                    telemovel = %s, 
                    cartaoCidadao = %s
                WHERE id = %s;
            """
        values = (self._encode(apostador.get_morada()), self._encode(apostador.get_telemovel()), self._encode(apostador.get_cc()), apostador.get_id())

        try:
            cursor.execute(query,values)
            connection.commit()
        except:
            return -1   

        return apostador.get_id()

    def _update_carteira(self, carteira : Carteira, userID : int):
        connection, cursor = connectToDB()     
        func = lambda y: self._update_moeda(y,userID, cursor, connection)
        carteira.map_moeda(func)

        return True
        

    def _update_moeda(self, moeda : Moeda, userID : int, cursor, connection):
        query = '''
                    UPDATE carteiramoeda set 
                    quantidade = %s
                    WHERE idUtilizador = %s AND idMoeda = '%s';
            ''' % (moeda.get_saldo(), userID, moeda.get_tipo())
    
        try:
            cursor.execute(query)
            connection.commit()
        except:
            return False


    def get_utilizador_id(self, id : int):
        _, cursor = connectToDB()

        query = """ 
                        SELECT nomeUtilizador, email, password FROM Utilizador
                        WHERE id = %s;
                """ % str(id)

        cursor.execute(query)

        if (x:=cursor.fetchone()) is not None:
            nomeUtil = x[0]
            email = x[1]
            password = x[2]

            query = """ 
                    SELECT morada, telemovel, cartaoCidadao FROM Apostador
                        WHERE id = '%s';
                """ % str(id)
            
            cursor.execute(query)

            if (x:=cursor.fetchone()) is not None:
                morada = self._decode(x[0])
                telemovel = self._decode(x[1])
                cc = self._decode(x[2])
                carteira = self._get_valores_moedas(id)
                return Apostador(id, nomeUtil, email, self._decode(password), carteira, morada, telemovel, cc)
            else:
                return Gestor(id, nomeUtil, email, password)

        else: 
            return None      

    def get_utilizador(self, nomeUtil : str):
        _, cursor = connectToDB()

        query = """ 
                        SELECT id, email, password FROM Utilizador
                        WHERE nomeUtilizador = '%s';
                """ % nomeUtil

        cursor.execute(query)

        if (x:=cursor.fetchone()) is not None:
            id = x[0]
            email = x[1]
            password = x[2]

            query = """ 
                    SELECT morada, telemovel, cartaoCidadao FROM Apostador
                        WHERE id = '%s';
                """ % id
            
            cursor.execute(query)

            if (x:=cursor.fetchone()) is not None:
                morada = self._decode(x[0])
                telemovel = self._decode(x[1])
                cc = self._decode(x[2])
                carteira = self._get_valores_moedas(id)
                return Apostador(id, nomeUtil, email, self._decode(password), carteira, morada, telemovel, cc)
            else:
                return Gestor(id, nomeUtil, email, password)

        else: 
            return None      
    

    def _get_valores_moedas(self, userID : int):
        
        _, cursor = connectToDB()

        query = """ 
                    SELECT idMoeda, quantidade FROM CarteiraMoeda AS CM
                    WHERE CM.idUtilizador = %s;
                """ % userID

        cursor.execute(query)


        carteira = Carteira()

        for r in cursor:
            carteira.add_saldo(r[0], float(r[1]))


        return carteira


    def existe_utilizador(self, username_register, email_register, cc_register):
        _, cursor = connectToDB()

        query = """ 
                    SELECT count(*) FROM Utilizador AS U
                    INNER JOIN Apostador AS A ON U.id = A.id
                    WHERE U.nomeUtilizador = '%s' OR U.email = '%s' OR A.cartaoCidadao = '%s';
                """ % (username_register, email_register, self._encode(cc_register))

        cursor.execute(query)
        result = cursor.fetchone()[0]

        return result > 0