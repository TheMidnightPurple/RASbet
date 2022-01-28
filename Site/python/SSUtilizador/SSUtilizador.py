
from SSUtilizador.Carteira import Carteira
from SSUtilizador.Utilizador import Apostador, Gestor, Utilizador
from SSUtilizador.UtilizadorDAO import UtilizadorDAO

from SSUtilizador.UtilizadorDAO import UtilizadorDAO
from SSUtilizador.Carteira import Moeda

class SSUtilizadorFacade:
    def __init__(self):
        self._utilizadores = UtilizadorDAO.instance()
        self._codigosUtilizadores = {}

    def validar_dados_utilizador(self, nomeUtil : str, password : str) -> int:
        utilizador = self._utilizadores.get_utilizador(nomeUtil)
        if utilizador and utilizador.get_password() == password:
            return utilizador.get_id()
        else:
            return -1

    def utilizador_repetido(self, nomeUtil : str, email_register : str, cc_register : str) -> bool:
        return self._utilizadores.existe_utilizador(nomeUtil, email_register, cc_register)

    def isGestor(self, nomeUtil : str) -> bool:
        u = self._utilizadores.get_utilizador(nomeUtil)
        
        if(isinstance(u, Gestor)):
            return True
        else:
            return False

    def registar_apostador(self, username_register, email_register, password_register, address_register, phone_register, cc_register):
        apostador = Apostador(-1,username_register,email_register,password_register,Carteira(), address_register, phone_register, cc_register)
        return self._utilizadores.put(apostador)
    
    def getCarteiraUtilizador(self, user : int) -> Carteira:
        u = self._utilizadores.get_utilizador_id(user)
        return u.get_carteira()
    
    def saldoUtilizadorValido(self, user : int, carteiraTemporaria : Carteira) -> bool:
        utilizador = self._utilizadores.get_utilizador_id(user)
        carteira = utilizador.get_carteira()
        return carteira.validaCarteira(carteiraTemporaria)

    def addSaldoUtilizador(self, user : int, moeda : Moeda) -> bool:
        u = self._utilizadores.get_utilizador_id(user)
        u.adicionarDinheiroMoeda(moeda)
        exit = self._utilizadores.put(u)
        return True
    
    def removeSaldoUtilizador(self, user : int, moeda : Moeda) -> bool:
        u = self._utilizadores.get_utilizador_id(user)
        u.retirarDinheiroMoeda(moeda)
        exit = self._utilizadores.put(u)
        return True

    def _existeCartao(self) -> bool:
        """
        Se o cartão existe TODO
        """
        return True
    
    def _transferirDinheiro(self, de : str, para : str) -> bool:
        """
        Transferir Dinheiro TODO
        """
        return True
    
    def _enviaCodigo(self, user : Apostador, codigo) -> bool:
        import smtplib
        import email.message

        FROM = 'rasbet2022@gmail.com'
        TO = user.get_email()
        SUBJECT = '[RASBet] Confirmação de levantamento'
        TEXT = f'O código para confirmar o seu levantamento é:\n {codigo}'

        msg = email.message.Message()
        msg['Subject'] = SUBJECT
        msg['From'] = FROM
        msg['To'] = TO
        password = 'mei12345678'
        msg.add_header('Content-Type', 'text/html')
        msg.set_payload(TEXT)

        try:
            s = smtplib.SMTP('smtp.gmail.com: 587')
            s.starttls()
            # Login Credentials for sending the mail
            s.login(msg['From'], password)
            s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        except:
            print('Email inválido.')

        return True

    def depositarQuantidadeMonetaria(self, user : int, moeda : Moeda, contaBancaria : str) -> bool:
        valido = moeda.get_saldo() > 0
        
        valido = valido and self._existeCartao()
        
        valido = valido and self._transferirDinheiro(contaBancaria, '')
        
        if(valido):
            
            u = self._utilizadores.get_utilizador_id(user)
            u.adicionarDinheiroMoeda(moeda)
            exit = self._utilizadores.put(u)
            #valido = valido and (exit > 0)

        return valido

    def inicioLevantarDinheiro(self, user : int, moeda : Moeda):
        valido = moeda.get_saldo() > 0
        
        if(valido):
            utilizador = self._utilizadores.get_utilizador_id(user)
            carteira = utilizador.get_carteira()
            carteiraTemporaria = Carteira()
            carteiraTemporaria.add_saldo(moeda.get_tipo(), moeda.get_saldo())
            valido = carteira.validaCarteira(carteiraTemporaria)
            import random
            if(valido):
                codigo = random.randint(1000,9999) 
                self._codigosUtilizadores[user] = codigo
                self._enviaCodigo(utilizador, codigo)

        return valido
    
    def fimLevantarDinheiro(self, user : int, moeda : Moeda, codigo : int, contaBancariaDepositar : str):
        valido = self._codigosUtilizadores[user] == codigo

        if(valido):
            utilizador = self._utilizadores.get_utilizador_id(user)
            carteira = utilizador.get_carteira()
            carteiraTemporaria = Carteira()
            carteiraTemporaria.add_saldo(moeda.get_tipo(), moeda.get_saldo())
            valido = carteira.validaCarteira(carteiraTemporaria)

            if(valido):
                utilizador.retirarDinheiroMoeda(moeda)
                exit = self._utilizadores.put(utilizador)
                #valido = (exit > 0)

                if(valido):
                    valido = self._transferirDinheiro('', contaBancariaDepositar)
                    self._codigosUtilizadores.pop(user)
        
        return valido
            
        
