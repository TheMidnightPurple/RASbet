from datetime import datetime
from SSAposta.Observer import Observer
from SSAposta.Evento import Evento
from SSUtilizador.Carteira import Moeda
from SSUtilizador.UtilizadorDAO import UtilizadorDAO
from SSUtilizador.Carteira import Carteira

class Aposta(Observer):
    
    def __init__(self, user : int, idParticipante : int, moeda : Moeda, evento : Evento, odd : float):
        self.__apostador = user
        self.__participante = idParticipante
        self.__evento = evento
        self.__moeda = moeda
        self.__odd = odd
    
    def getMoeda(self) -> Moeda:
        return self.__moeda
    
    def getUtilizador(self):
        utilizadorDAO = UtilizadorDAO.instance()
        return utilizadorDAO.get_utilizador_id(self.__apostador)
    
    def getEvento(self):
        return self.__evento
    
    def getIDUtilizador(self):
        return self.__apostador

    def getIDParticipante(self):
        return self.__participante
    
    def getOdd(self):
        return self.__odd

    def _notificaUtilizador(self, user, Text) -> bool:
        import smtplib
        import email.message

        FROM = 'rasbet2022@gmail.com'
        TO = user.get_email()
        SUBJECT = '[RASBet] Aposta concluida'

        msg = email.message.Message()
        msg['Subject'] = SUBJECT
        msg['From'] = FROM
        msg['To'] = TO
        password = 'mei12345678'
        msg.add_header('Content-Type', 'text/html')
        msg.set_payload(Text)

        try:
            s = smtplib.SMTP('smtp.gmail.com: 587')
            s.starttls()
            # Login Credentials for sending the mail
            s.login(msg['From'], password)
            s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        except:
            print('Email inválido.')

        return True

    def update(self):

        utilizador = self.getUtilizador()
        
        ganhouAposta = self.__evento.getResultado() == self.__participante
        
        if ganhouAposta:

            tipo_moeda = self.__moeda.get_tipo()
            import math
            saldo = math.floor(self.__moeda.get_saldo() * self.__odd*100.0)/100.0

            moeda = Moeda.instance(tipo_moeda, saldo)
            utilizador.adicionarDinheiroMoeda(moeda)

            UtilizadorDAO.instance().put(utilizador)

            self._notificaUtilizador(utilizador, f'Parabéns!! Está um passo mais perto de ser milionário... {datetime.now().strftime("%d-%m-%Y %H:%M")} ganhou cerca de {saldo} {tipo_moeda} foram depositados na sua conta (Foi apostado {self.__moeda.get_saldo()} {tipo_moeda}). Continue a apostar na RasBet. Fique seguro.')
        else:
            self._notificaUtilizador(utilizador, f'Que pena... Desta vez ({datetime.now().strftime("%d-%m-%Y %H:%M")}) não ganhou... mas não desista, amigo, amanhã pode ser o seu dia de sorte. Força Braga. Fique seguro.')
