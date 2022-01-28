import ssl
import requests
import json
from datetime import datetime

from SSAPI.ParticipantesDAO import ParticipantesDAO
from SSAposta.Equipa import Equipa
from SSAposta.Prova import Prova
from SSAposta.Jogo import Jogo
from SSAposta.EventoDAO import EventoDAO
from SSAposta.Atleta import Atleta
from SSAPI.faces import *

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import os
import sys

from SSAposta.ResultadoBehaviour import Cancelado

class API:
    
    __payload = {}
    __headers = { 'X-Auth-Token': 'b62a8a191117488f879d8d4491f71d28'}

    def __init__(self):
        self.__paticipantes = ParticipantesDAO.instance()
        self.__eventos = EventoDAO.instance()
    

    #obter equipas API
    def getEquipas(self) -> None:
        ssl._create_default_https_context = ssl._create_unverified_context
        equipas = requests.request("GET", "https://api.football-data.org/v2/competitions/PPL/teams", headers=self.__headers, data=self.__payload)
        equipas_json = json.loads(equipas.text)

        for team in equipas_json['teams']:
            equipa = Equipa(int(team["id"]), team["name"], team["crestUrl"])
            self.__paticipantes.putEquipa(equipa)

        equipas = requests.request("GET", "https://api.football-data.org/v2/competitions/CL/teams", headers=self.__headers, data=self.__payload)
        equipas_json = json.loads(equipas.text)

        for team in equipas_json['teams']:
            equipa = Equipa(int(team["id"]), team["name"], team["crestUrl"])
            self.__paticipantes.putEquipa(equipa)

    
    
    #obter jogos API
    def getJogos(self) -> None:
        def strip_accents(s):
            import unicodedata
            return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')
        
        ssl._create_default_https_context = ssl._create_unverified_context
        jogosCL = requests.request("GET", "https://api.football-data.org/v2/competitions/PPL/matches?status=SCHEDULED", headers=self.__headers, data=self.__payload) 
        jogosCL_json = json.loads(jogosCL.text)
        jogosCL = jogosCL_json["matches"]

        odds = self.getOdds()   
        to_remove = None
        
        for jogoCL in jogosCL: 
            hometeam_name = strip_accents(jogoCL["homeTeam"]['name'])
            awayteam_name = strip_accents(jogoCL["awayTeam"]['name'])

            odd = [0,0,0]
            for jogo in odds:
                fst_h = strip_accents(jogo[0][0].split(' ')[0])
                fst_a = strip_accents(jogo[2][0].split(' ')[0])

                if fst_h in hometeam_name and fst_a in awayteam_name:
                    to_remove = jogo
                    odd = [jogo[0][1],jogo[1][1],jogo[2][1]]
                    break
            if to_remove:
                odds.remove(to_remove)
                to_remove = None

            e1 = Equipa(int(jogoCL["homeTeam"]['id']), hometeam_name, '')
            e2 = Equipa(int(jogoCL["awayTeam"]['id']), awayteam_name, '')
            jogo = Jogo(int(jogoCL['id']), 'Campeonato Português', datetime.fromisoformat(jogoCL["utcDate"][:-1]), e1, e2, odds=odd)
            self.__eventos.putEvento(jogo)
            


    #obter resultados dos jogos terminados API
    def getResultadosJogos(self) -> list():
        
        res = []

        ssl._create_default_https_context = ssl._create_unverified_context
        jogosCL = requests.request("GET", "https://api.football-data.org/v2/competitions/PPL/matches?status=FINISHED", headers=self.__headers, data=self.__payload) 
        jogosCL_json = json.loads(jogosCL.text)
        jogosCL = jogosCL_json["matches"]
        #print(jogosCL)

        for jogoCL in jogosCL:
            id = jogoCL['id']
            equipaVencedora = jogoCL['score']['winner']
            
            idEquipaVencedora = jogoCL['homeTeam']['id']
            
            if equipaVencedora == 'AWAY_TEAM':
                idEquipaVencedora = jogoCL['awayTeam']['id']
            elif equipaVencedora == 'DRAW':
                idEquipaVencedora = -1

            res.append((id, idEquipaVencedora))
        
        return res

    #obter classificação das Equipas API
    def get_classification(self) -> list():

        ssl._create_default_https_context = ssl._create_unverified_context
        standings = requests.request("GET", "https://api.football-data.org/v2/competitions/PPL/standings", headers=self.__headers, data=self.__payload)
        standings_json = json.loads(standings.text)
        teams_status = standings_json["standings"][0]["table"] # lista com equipas e as suas informações

        res = []
        for team in teams_status:
            x = {}
            x["Posicao"] = team["position"]
            x["Nome"] = team["team"]["name"]
            x["Logo"] = team["team"]["crestUrl"]
            x["Vitorias"] = team["won"]
            x["Derrotas"] = team["lost"]
            x["Pontos"] = team["points"]
            x["DeltaGolos"] = team["goalDifference"]
            res.append(x)

        return res
    
    
    #obter pilotos da API
    def getPilotos(self):
        
        ssl._create_default_https_context = ssl._create_unverified_context
        pilotos = requests.request("GET", "https://ergast.com/api/f1/2021/drivers.json", data=self.__payload) 
        pilotos_json = pilotos.json()
        
        id_piloto = 9000
        for i in range(21):
            # falta saber id e url da imagem
            piloto = pilotos_json["MRData"]["DriverTable"]["Drivers"][i]
            nome = piloto["givenName"] + " " + piloto["familyName"]
            piloto = Atleta(id_piloto , nome, get_link_to_face(nome))
            id_piloto = id_piloto + 1
            self.__paticipantes.putAtleta(piloto)
    

    #obter provas F1 API
    def getProvas(self):
        
        #obter pilotos que vão participar na prova
        pilotos = self.__paticipantes.getAtletas()

        if pilotos:
            
            oddsTemp = []
            temp = []
            import random
            for x, y, z, t in pilotos:
                atl = Atleta(x,y,t)
                temp.append(atl)
                odd = random.uniform(1.20, 4.25)
                oddsTemp.append(odd)

            #obter as datas e nomes das provas
            ssl._create_default_https_context = ssl._create_unverified_context
            f1_season_info = requests.request("GET", "https://ergast.com/api/f1/2021.json", data=self.__payload)
            f1_season_json = f1_season_info.json()
            
            corridas = f1_season_json["MRData"]["RaceTable"]["Races"]
            
            id_evento = 0
            for corrida in corridas:
                prova = Prova(id_evento , corrida['raceName'], datetime.fromisoformat(corrida["date"]), temp, odds=oddsTemp)
                id_evento = id_evento + 1
                self.__eventos.putEvento(prova)

    def getOdds(self):
        sys.stderr = open(os.devnull, 'w')

        options = webdriver.ChromeOptions()
        options.headless = True 
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        web = 'https://www.casinoportugal.pt/desportos/destaque/107' #you can choose any other league
        path = '../dependencies/chromedriver.exe' #introduce your file's path inside '...'
        
        driver = webdriver.Chrome(path, options=options)
        driver.get(web)
        conteudo = []
        titles = WebDriverWait(driver, 0.5).until(EC.visibility_of_all_elements_located((By.XPATH, f'/html/body/div[2]/div[6]/div/div[3]/div[2]/div[4]/div[2]')))
        
        temp = titles[0].text.splitlines()
        jogo = [(temp[2] , temp[7]) ,('Empate', temp[8]), (temp[3], temp[9])]
        conteudo.append(jogo)

        i = 3
        while i < 11:
            titles = WebDriverWait(driver, 0).until(EC.visibility_of_all_elements_located((By.XPATH, f'/html/body/div[2]/div[6]/div/div[3]/div[2]/div[4]/div[{i}]')))
            temp = titles[0].text.splitlines()
            jogo = [(temp[2] , temp[7]) ,('Empate', temp[8]) ,(temp[3], temp[9])]
            conteudo.append(jogo)
            i+=1

        driver.quit()
        sys.stderr = sys.__stderr__

        return conteudo

    def get_classificationF1(self) -> dict():
        
        f1_pilots_info = requests.request("GET", "https://ergast.com/api/f1/2021/13/driverStandings.json", data=self.__payload)
        f1_pilots = f1_pilots_info.json()

        info = f1_pilots["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
        pilotos = self.__paticipantes.getAtletas()

        classificacao = {}

        i = 0
        for piloto in info:
            classificacao[i] = {}
            classificacao[i]["posicao"] = piloto["position"]
            classificacao[i]["nome"] = piloto["Driver"]["givenName"] + " " + piloto["Driver"]["familyName"]
            classificacao[i]["pontos"] = piloto["points"]

            for x, y, z, t in pilotos:
                if(classificacao[i]["nome"] == y):
                    classificacao[i]["logoURL"] = t
                    break
            i+=1
        
        return classificacao
    
    def get_JogosCancelados(self, jornadaInicio : int, jornadaFim : int) -> None:
        import time
        
        res = []
        ssl._create_default_https_context = ssl._create_unverified_context

        match = jornadaInicio
        while match <= jornadaFim:
            jogosCL = requests.request("GET", f"https://api.football-data.org/v2/competitions/PPL/matches?matchday={match}", headers=self.__headers, data=self.__headers) 
            jogosCL_json = json.loads(jogosCL.text)
            jogosCL = jogosCL_json["matches"]

            jogosSemana = {}
            for jogoCL in jogosCL:
                d = datetime.fromisoformat(jogoCL["utcDate"][:-1])
                
                chave1 = int(d.isocalendar().week) + int(d.isocalendar().year)
                chave2 = int(d.isocalendar().week) - 1 + int(d.isocalendar().year)

                chave = 0
                if jogosSemana.get(chave1) is None:
                    if jogosSemana.get(chave2) is None:
                        chave = chave1
                    elif jogosSemana.get(chave2) is not None and len(jogosSemana) > 0:
                        chave = chave2
                
                if chave == 0:
                    chave = chave1

                if jogosSemana.get(chave) is None:
                    jogosSemana[chave] = []
                
                jogosSemana[chave].append( ( int(jogoCL["id"]) ) )
            
            menor = []
            if len(jogosSemana) > 1:
                
                numMax = -1
                idMax = -1
                for x11, y11 in jogosSemana.items():
                    if len(y11) > numMax:
                        numMax = len(y11)
                        idMax = x11 
                
                for x11, y11 in jogosSemana.items():
                    if x11 != idMax:
                        for abc in y11:
                            menor.append(abc)
            
            if menor is not []:
                for x11 in menor:
                    res.append(x11)
            
            time.sleep(20)
            match += 1

        for idEvento in res:
            jogo = self.__eventos.getEvento(idEvento)
            
            if(jogo.getResultado() is None):
                jogo.setCancelado()
                self.__eventos.putEvento(jogo)
