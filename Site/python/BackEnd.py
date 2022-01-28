import eel # instalar: pip install eel 
from datetime import datetime
from SSAPI.ParticipantesDAO import ParticipantesDAO
from SSAPI.Taxas import Taxas
from SSAposta.Aposta import Aposta
from SSAposta.EventoDAO import EventoDAO
from SSAposta.SSApostaFacade import SSApostaFacade
from SSUtilizador.Carteira import Moeda
from SSUtilizador.SSUtilizador import SSUtilizadorFacade
from SSAPI.SSApiFacade import API
from SSReport.ReportFacade import SSReportFacade
from SSReport.Report import Report
from SSUtilizador.Carteira import Carteira

api = API()
apostasFacade = SSApostaFacade()
utilizadorFacade = SSUtilizadorFacade()
reports = SSReportFacade()

eel.init('../templates')            # diretório da componente web/frontend

################################## Atualiza dados BD #################################

def atualizaResultados():
    atualizou = False
    listaResultados = api.getResultadosJogos()

    for idEvento, idEquipa in listaResultados:
        atualizouTemp = apostasFacade.setEventoFinalizado(idEvento, idEquipa)
        
        if(atualizouTemp):
            atualizou = True
    
    if(atualizou):
        reports.addReport(Report(text='Atualizou os Resultados dos jogos!'))

def atualizaBD():
    api.getJogos()
    api.getProvas()
    reports.addReport(Report(text='Atualizou os Jogos e as Provas para aposta!'))

def atualizaCancelados():
    api.get_JogosCancelados(18, 20)
    reports.addReport(Report(text='Atualizou os Jogos e as Provas canceladas!'))

################################## Login/Register ####################################

#validar dados login utilizador
@eel.expose
def valida_dados_utilizador(nome, password) -> int:
    return utilizadorFacade.validar_dados_utilizador(nome,password)

#verificar se já existe o username, email ou cc na base de dados(não sei se basta verificar se username já existe)
@eel.expose
def user_repetido(username_register, email_register, cc_register) -> bool:
    return int(utilizadorFacade.utilizador_repetido(username_register, email_register, cc_register))

#registar user na base de dados (podia unir com função acima)
@eel.expose
def registar_user(username_register, email_register, password_register, address_register, phone_register, cc_register):
    return utilizadorFacade.registar_apostador(username_register, email_register, password_register, address_register, phone_register, cc_register)

@eel.expose
def isGestor(nome : str) -> bool: 
    return utilizadorFacade.isGestor(nome)

############################################### Apostar #######################
#obter informação de cada jogo da base de dados
@eel.expose
def obter_jogos_da_bd() -> None:

    #aparece loding no ecrã
    eel.ativaLoadingAposta()

    apostas = apostasFacade.getEventosDisponiveis(0, 10)
    
    for aposta in apostas:
        dados_jogo = {}

        dados_jogo['idEvento'] = aposta.get_id_evento()
        dados_jogo['Competicao'] = aposta.get_competicao_evento()
        dados_jogo['Data'] = aposta.get_data_evento().strftime("%d-%m-%Y %H:%M")

        dados_jogo['equipaCasa'] = aposta.get_participantes()[0].getName()
        dados_jogo['equipaFora'] = aposta.get_participantes()[1].getName()

        dados_jogo['idEquipaCasa'] = aposta.get_participantes()[0].getId()
        dados_jogo['idEquipaFora'] = aposta.get_participantes()[1].getId()

        dados_jogo['logotipoCasa'] = aposta.get_participantes()[0].getLogotipo()
        dados_jogo['logotipoFora'] = aposta.get_participantes()[1].getLogotipo()
        
        odds = aposta.get_all_odds()
        dados_jogo['oddCasa'] = odds[0]
        dados_jogo['oddEmpate'] = odds[1]
        dados_jogo['oddFora'] = odds[2]

        if(aposta.getResultado() != -2):
            eel.add_aposta_futebol(dados_jogo)
    
    #remover o loading screen
    eel.desativaLoadingAposta()

#obter classificação das equipas numa dada aposta
@eel.expose
def adiciona_classificacao_equipa(equipaCasa, equipaFora) -> None:

    equipas = api.get_classification()

    for equipa in equipas:
        eel.classificacao_equipa(equipa, equipaCasa, equipaFora)

#obter informação de uma prova eos seus pilotos da base de dados
@eel.expose
def obter_pilotos_proxima_prova_F1() -> None:

    #aparece loding no ecrã
    eel.ativaLoadingAposta()

    provas = apostasFacade.getEventosDisponiveis(1, 10, datetime.fromisoformat('2021-09-11 00:00:00'))

    info_prova = {}
    info_prova["Dados"] = {}
    info_prova["Dados"]["pilotos"] = {}

    for prova in provas:
        
        info_prova["Dados"]["idProva"] = prova.get_id_evento()
        info_prova["Dados"]["nome_prova"] = prova.get_competicao_evento()
        info_prova["Dados"]["data_prova"] = prova.get_data_evento().strftime("%d-%m-%Y")

        i=0
        for piloto in prova.get_participantes():
            info_prova["Dados"]["pilotos"][i] = {}
            info_prova["Dados"]["pilotos"][i]["name"] = piloto.getName()            
            info_prova["Dados"]["pilotos"][i]["face"] = piloto.getFoto()
            info_prova["Dados"]["pilotos"][i]["odd"] = float(prova.get_odds(piloto))
            info_prova["Dados"]["pilotos"][i]["idPiloto"] = piloto.getId()
            i+=1

    eel.add_aposta_F1(info_prova)    
    todos_pilotos = info_prova["Dados"]["pilotos"]

    for cada_piloto in todos_pilotos:
        eel.add_f1_driver_box(info_prova["Dados"]["pilotos"][cada_piloto])
    
    #remover o loading screen
    eel.desativaLoadingAposta()

#obter classificação de cada piloto
@eel.expose
def adiciona_classificacao_F1() -> None:
    classificacao = api.get_classificationF1()
    for x, y in classificacao.items():
        eel.classificacao_F1(y)

@eel.expose 
def regista_aposta_realizada_bd(idEv, idUt, tipo_moeda, montante, odd, idVencedor) -> bool:
    
    try:
        idVencedor = int(idVencedor)
    except:
        idVencedor = -1

    eventoDAO = EventoDAO.instance()
    evento = eventoDAO.getEvento(idEv)
    
    participantes = evento.get_participantes()
    participante = None
    for p in participantes:
        if(p.getId() == int(idVencedor)):
            participante = p
            break

    odd_real = evento.get_odds(participante)
    aposta = Aposta(int(idUt), idVencedor, Moeda.instance(tipo_moeda, montante), evento, odd_real)
    boletim = []
    boletim.append(aposta)

    return apostasFacade.confirmar_boletim_apostas(boletim, idUt)

######################################################################## Moedas ########################################################

#obter os valores de cada moeda do utilizador(devolve lista valores de cada moeda, pela ordem de (€,$,£,Cardano). Por exemplo, [1.00, 4.00, 0.00, 3])
@eel.expose
def get_valores_moedas(userID : int) -> list():
    
    carteira = utilizadorFacade.getCarteiraUtilizador(userID)

    saldos = []
    saldos.append(carteira.get_saldo('€'))
    saldos.append(carteira.get_saldo('$'))
    saldos.append(carteira.get_saldo('£'))
    saldos.append(carteira.get_saldo('ADA'))

    return saldos

@eel.expose
def converteMoeda(de, para, quantidade : float, user : int) -> bool:
    carteiraTemporaria = Carteira()
    carteiraTemporaria.add_saldo(de, float(quantidade))
    valido = utilizadorFacade.saldoUtilizadorValido(user,carteiraTemporaria)
    
    if(valido):
        moedaRecebida = Moeda.instance(tipo=de, montante=float(quantidade))
        quantidadeEuro = moedaRecebida.converteParaEuro(float(quantidade))
        
        moedaConvertida = Moeda.instance(para, 0)
        moedaConvertida.converteDeEuro(quantidadeEuro)
        
        utilizadorFacade.removeSaldoUtilizador(moeda=moedaRecebida, user=user)
        utilizadorFacade.addSaldoUtilizador(moeda=moedaConvertida, user=user)

    return valido

@eel.expose
def depositarDinheiro(user : int, contaBancaria : str, quantidade : float, tipoMoeda : str) -> bool:
    moeda = Moeda(saldo=float(quantidade), tipo=tipoMoeda)
    return utilizadorFacade.depositarQuantidadeMonetaria(user, moeda, contaBancaria)

@eel.expose
def levantarDinheiro(user : int, contaBancariaDepositar : str, quantidade : float, tipoMoeda : str) -> bool:
    moeda = Moeda(saldo=quantidade, tipo=tipoMoeda)
    return utilizadorFacade.inicioLevantarDinheiro(user, moeda)

@eel.expose
def confirmarLevantarDinheiro(user : int, codigo : int, contaBancariaDepositar : str, quantidade : float, tipoMoeda : str) -> bool:
    moeda = Moeda(saldo=quantidade, tipo=tipoMoeda)
    return utilizadorFacade.fimLevantarDinheiro(user, moeda, codigo, contaBancariaDepositar)

###################################################################### Histórico #################################

#obter lista com boletins de apostas que ainda estejam a decorrer
@eel.expose
def get_user_apostas(id_utilizador) -> list():
    import math
    apostas = apostasFacade.get_historico(id_utilizador)

    dados = []
    for aposta in apostas:
        evento = aposta.getEvento()
        idParticipante = aposta.getIDParticipante()
        moeda = aposta.getMoeda()
        res = evento.getDados(idParticipante) 
        # res = {'logos' : [...], 'nomes': [...]}
        res['estado'] = 0 if (evento.getResultado() is None or evento.getResultado() == -2) else 1
        res['odd'] = aposta.getOdd()
        res['tipoMoeda'] = moeda.get_tipo()
        res['montante'] = moeda.get_saldo()
        res['ganhou'] = idParticipante == evento.getResultado()
        res['ganhos'] = math.floor(moeda.get_saldo() * aposta.getOdd()*100.0)/100.0
        dados.append(res)
            
    return dados

###################################################################### Reports #################################

#guardar problema reportado
@eel.expose
def guardar_problema(problema : str) -> bool:
    return reports.addReport(Report(text=problema))

@eel.expose
def getReportedProblems() -> list():
    rs = reports.getAllReports()

    res = []
    for r in rs:
        x = {}
        x['Problema'] = r.getText()
        x['Data'] = r.getData().strftime("%d-%m-%Y %H:%M")

        res.append(x)
    
    return res

###################################################################### ####### #################################

# Metodo executado quando a janela no browser fecha
def close_callback(route, websockets): 
    pass

def get_ip_address() -> str:
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))  
    res = s.getsockname()[0]
    s.close()
    return res

local_ip = 'localhost' # get_ip_address()

# Start the index.html file
def main():
    print('Server open on: http://' + local_ip)
    eel.start('index.html', mode=None, host=local_ip, port=80, close_callback=close_callback)

def main0():
    import time
    while True:
        atualizaResultados()
        time.sleep(120)

def main1():
    import time
    while True:
        time.sleep(300)
        atualizaBD()

def main2():
    import time
    while True:
        atualizaCancelados()
        time.sleep(86400)

def main3():
    import time
    while True:
        #Taxas.atualizarTaxas()
        time.sleep(86400)

if __name__ == '__main__':

    if ParticipantesDAO.primeiraVez():
        api.getEquipas()
        api.getJogos()
        api.getPilotos()
        api.getProvas()
        api.getResultadosJogos()

    import threading
    threading.Thread(target = main0, args=(), daemon=True).start()
    threading.Thread(target = main1, args=(), daemon=True).start()
    threading.Thread(target = main2, args=(), daemon=True).start()
    threading.Thread(target = main3, args=(), daemon=True).start()
    
    main()