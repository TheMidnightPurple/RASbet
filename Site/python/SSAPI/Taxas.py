import ssl
import requests
import json
from datetime import datetime

class Taxas:
    
    USD = 1.133472
    CAD = 0.77
    GBP = 0.850767

    def atualizarTaxas():
        data = datetime.now().strftime("%Y-%m-%d")
        
        ssl._create_default_https_context = ssl._create_unverified_context
        taxas = requests.request("GET", f"http://api.exchangeratesapi.io/v1/{data}?access_key=0711adec090e913e4a0118b10563d7f9&symbols=USD,CAD,GBP&format=1") 
        taxas_json = json.loads(taxas.text)

        Taxas.USD = float(taxas_json["rates"]["USD"])
        Taxas.CAD = 1/float(taxas_json["rates"]["CAD"])
        Taxas.GBP = float(taxas_json["rates"]["GBP"])