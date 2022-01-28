if(sessionStorage.getItem("idUtilizador") == null){
    window.location.replace('/')
}

var lingua_pretendida="pt"
var selected_mode = "futebol"
var user_menu = false
var moeda_atual = "€"
var id_utilizador = sessionStorage.getItem("idUtilizador");
let moedas = {
    "€": 0.00,
    "$": 0.00,
    "£": 0.00, 
    "ADA": 0.00
}

//quando se faz logout
function return_menu_login(){
    sessionStorage.removeItem('idUtilizador')
    sessionStorage.removeItem('lingua_site')
    window.location = '/';
}


//colocar saldos no topo
eel.expose(mete_saldo);
async function mete_saldo(){
   
    var lista_valores_moedas = await eel.get_valores_moedas(id_utilizador)();

    moedas["€"] = lista_valores_moedas[0];
    moedas["$"] = lista_valores_moedas[1];
    moedas["£"] = lista_valores_moedas[2];
    moedas["ADA"] = lista_valores_moedas[3];
    
    saldo = moedas[moeda_atual]

    HTML_saldo = `
        <h6 class="pt">Saldo: </h6>
        <h6 class="en">Balance: </h6>
        <h5>${saldo} ${moeda_atual}</h5>
    `;

    var elem = document.querySelector('.saldo_valor');
    elem.innerHTML = HTML_saldo;

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}

async function atualizaSaldo(){
    await mete_saldo();
}

atualizaSaldo();


//mudar para tipo de moeda anterior
function mudar_tipo_moeda_previous(){
    

    for (let i=0; i<4; i++){
        var moeda = Object.keys(moedas)[i];
        if (moeda == moeda_atual){
            if (moeda !== "€"){
                var nova_moeda_tipo = Object.keys(moedas)[i-1];
                var nova_moeda_valor = Object.values(moedas)[i-1];
                moeda_atual = nova_moeda_tipo;

                HTMLNovo = `
                    <h6 class="pt">Saldo: </h6>
                    <h6 class="en">Balance: </h6>
                    <h5>${nova_moeda_valor} ${nova_moeda_tipo}</h5>
                `;

                var seccao_moeda = document.querySelector('.saldo_valor');
                seccao_moeda.innerHTML = HTMLNovo;
                break;
            }
        }
    }  

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


//mudar para tipo de moeda anterior
function mudar_tipo_moeda_next(){
    

    for (let i=0; i<4; i++){
        var moeda = Object.keys(moedas)[i];
        if (moeda == moeda_atual){
            if (moeda !== "ADA"){
                var nova_moeda_tipo = Object.keys(moedas)[i+1];
                var nova_moeda_valor = Object.values(moedas)[i+1];
                moeda_atual = nova_moeda_tipo;

                HTMLNovo = `
                    <h6 class="pt">Saldo: </h6>
                    <h6 class="en">Balance: </h6>
                    <h5>${nova_moeda_valor} ${nova_moeda_tipo}</h5>
                `;

                var seccao_moeda = document.querySelector('.saldo_valor');
                seccao_moeda.innerHTML = HTMLNovo;
                break;
            }
        }
    }  

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}

//caixa que abre quando se seleciona icone utilizador
function abrir_info_utilizador(){  

    if (!user_menu){
        document.querySelector('.info_utilizador_opcoes').style.display = "block"; 
        user_menu = true;
    }
    else{
        document.querySelector('.info_utilizador_opcoes').style.display = "none"; 
        user_menu = false;
    }  
}


//caixa para converter moedas
function converter_moedas(){
    document.querySelector('.info_utilizador_opcoes').style.display = "none";
    user_menu = false; 
    document.getElementById("menu_levantar").style.display = "none";
    document.getElementById("menu_depositar").style.display = "none";
    document.getElementById("menu_reportar_problema").style.display = "none";
    document.getElementById("menu_consultar_historico").style.display = "none";
    document.querySelector('.zona_converter_moeda').style.display = "block";
}

async function confirmar_converter(){

    var montante_de = document.getElementById("moeda_converter_de").value;
    var moeda_de = document.getElementById("mcd").value;
    var moeda_para = document.getElementById("mcp").value;

    var temp_montante_de = moedas[moeda_de];
    moedas[moeda_de] = roundToTwo(temp_montante_de - parseFloat(montante_de));
    //await eel.update_saldo_moeda(moeda_de, moedas[moeda_de], id_utilizador)();

    var res = await eel.converteMoeda(moeda_de, moeda_para, parseFloat(montante_de), id_utilizador)()

    if(res){
        atualizaSaldo();

        //apagar dados metidos
        document.getElementById("moeda_converter_de").setCustomValidity('');
        document.getElementById("moeda_converter_de").value = "";
        document.getElementById("mcd").value = "€";
        document.getElementById("mcp").value = "€";
        document.getElementById("menu_converter").style.display = "none"; 


        try{
            document.querySelector('.alert_converter').remove();
        }catch (ignore){}
    }
    else{
        document.getElementById("moeda_converter_de").setCustomValidity('Saldo Insuficiente');
    }
}

//fechar caixa converter moedas
function cancelar_converter(){
    document.getElementById("moeda_converter_de").value = "";
    document.getElementById("mcd").value = "€";
    document.getElementById("mcp").value = "€";
    document.getElementById("menu_converter").style.display = "none";
    
    try{
        document.querySelector('.alert_converter').remove();
    }catch (ignore){}  
}


//caixa do historico
async function consultar_historico(){
    document.querySelector('.info_utilizador_opcoes').style.display = "none";
    user_menu = false; 
    document.getElementById("menu_levantar").style.display = "none";
    document.getElementById("menu_depositar").style.display = "none";
    document.getElementById("menu_reportar_problema").style.display = "none";
    document.querySelector('.zona_converter_moeda').style.display = "none";
  

    var listaApostas = await eel.get_user_apostas(id_utilizador)();

    for (const aposta of listaApostas) {

        let size_names = (aposta.nomes).length
        
        if (size_names == 1){//é F1
            
            let logo= aposta.logos[0]
            let nome= aposta.nomes[0]
            let nomeEvento = aposta.nomeProva

            if (aposta.estado == 0){//f1 está ativa

                HTML_aposta_ativa = `
                    <div class="aposta_ativa_box">
                        <div class="aposta_ativa_logos_solo">
                            <img src="${logo}" width="60px" height="60px">
                        </div>

                        <div class="aposta_ativa_nomes">
                            <div class="nomes_em_linha">
                                <h5>${nome}</h5>
                            </div>

                            <p class="pt">Vencedor ${nomeEvento}</p>
                            <p class="en">Winner ${nomeEvento}</p>

                            <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                            <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                            <h4 class="pt">Ganhos Possíveis: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                            <h4 class="en">Possible Gains: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                        </div>                
                    </div>
                `;

                var y = document.querySelector('.caixas_apostas_ativas')
                y.insertAdjacentHTML('beforeend', HTML_aposta_ativa);
            }
            else{//f1 já terminou

                if (aposta.ganhou == true){//o piloto ganhou

                    HTML_aposta_encerrada = `
                    <div class="aposta_encerrada_box_win">
                        <div class="aposta_encerrada_logos_solo">
                            <img src="${logo}" width="60px" height="60px">
                        </div>

                        <div class="aposta_encerrada_nomes">
                            <div class="nomes_em_linha">
                                <h5>${nome}</h5>
                            </div>
                            
                            <p class="pt">Vencedor ${nomeEvento}</p>
                            <p class="en">Winner ${nomeEvento}</p>

                            <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                            <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                            <h4 class="pt">Ganhos: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                            <h4 class="en">Won: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                        </div>                
                    </div>
                    `;

                    var y = document.querySelector('.caixas_apostas_encerradas')
                    y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                }
                else{//o piloto perdeu
                    HTML_aposta_encerrada = `
                    <div class="aposta_encerrada_box_loss">
                        <div class="aposta_encerrada_logos_solo">
                            <img src="${logo}" width="60px" height="60px">
                        </div>

                        <div class="aposta_encerrada_nomes">
                            <div class="nomes_em_linha">
                                <h5>${nome}</h5>
                            </div>

                            <p class="pt">Vencedor ${nomeEvento}</p>
                            <p class="en">Winner ${nomeEvento}</p>

                            <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                            <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                            <h4 class="pt">Ganhos: 0 ${aposta.tipoMoeda}</h4>
                            <h4 class="en">Won: 0 ${aposta.tipoMoeda}</h4>
                        </div>                
                    </div>
                    `;

                    var y = document.querySelector('.caixas_apostas_encerradas')
                    y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                }
            }
        }
        else{
            
            let size = (aposta.logos).length
            
            if (size == 1){//é futebol

                if (aposta.info == 'casa'){//apostou na equipa casa
                    
                    if (aposta.estado == 0){// casa ativo
                        let logoCasa = aposta.logos[0]
                        let nomeCasa = aposta.nomes[0]
                        let nomeFora = aposta.nomes[1]

                        HTML_aposta_ativa = `
                            <div class="aposta_ativa_box">
                                <div class="aposta_ativa_logos_solo">
                                    <img src="${logoCasa}" width="60px" height="60px">
                                </div>

                                <div class="aposta_ativa_nomes">
                                    <div class="nomes_em_linha">
                                        <h5>${nomeCasa}</h5>
                                        <p>&nbsp;vs ${nomeFora}</p>
                                    </div>

                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganhos Possíveis: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Possible Gains: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                        `;

                        var y = document.querySelector('.caixas_apostas_ativas')
                        y.insertAdjacentHTML('beforeend', HTML_aposta_ativa);
                    }
                    else{//casa acabou
                        let logoCasa = aposta.logos[0]
                        let nomeCasa = aposta.nomes[0]
                        let nomeFora = aposta.nomes[1]

                        if (aposta.ganhou == true){//casa ganhou

                            HTML_aposta_encerrada = `
                            <div class="aposta_encerrada_box_win">
                                <div class="aposta_encerrada_logos_solo">
                                    <img src="${logoCasa}" width="60px" height="60px">
                                </div>

                                <div class="aposta_encerrada_nomes">
                                    <div class="nomes_em_linha">
                                        <h5>${nomeCasa}</h5>
                                        <p>&nbsp;vs ${nomeFora}</p>
                                    </div>

                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganho: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Won: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                            `;

                            var y = document.querySelector('.caixas_apostas_encerradas')
                            y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                        }
                        else{//casa perdeu
                            HTML_aposta_encerrada = `
                            <div class="aposta_encerrada_box_loss">
                                <div class="aposta_encerrada_logos_solo">
                                    <img src="${logoCasa}" width="60px" height="60px">
                                </div>

                                <div class="aposta_encerrada_nomes">
                                    <div class="nomes_em_linha">
                                        <h5>${nomeCasa}</h5>
                                        <p>&nbsp;vs ${nomeFora}</p>
                                    </div>
                                    
                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganho: 0 ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Won: 0 ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                            `;

                            var y = document.querySelector('.caixas_apostas_encerradas')
                            y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                        }
                    }                
                }
                else{//equipa fora

                    if (aposta.estado == 0){//equipa fora ativa
                        let logoFora = aposta.logos[0]
                        let nomeCasa = aposta.nomes[0]
                        let nomeFora = aposta.nomes[1]

                        HTML_aposta_ativa = `
                            <div class="aposta_ativa_box">
                                <div class="aposta_ativa_logos_solo">
                                    <img src="${logoFora}" width="60px" height="60px">
                                </div>

                                <div class="aposta_ativa_nomes">
                                    <div class="nomes_em_linha">
                                        <p>${nomeCasa} vs&nbsp;</p>
                                        <h5>${nomeFora}</h5>
                                    </div>
                                    
                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganhos Possíveis: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Possible Gains: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                        `;

                        var y = document.querySelector('.caixas_apostas_ativas')
                        y.insertAdjacentHTML('beforeend', HTML_aposta_ativa);
                    }
                    else{//equipa fora terminou

                        let logoFora = aposta.logos[0]
                        let nomeCasa = aposta.nomes[0]
                        let nomeFora = aposta.nomes[1]

                        if (aposta.ganhou == true){//equipa fora ganhou
                            HTML_aposta_encerrada = `
                            <div class="aposta_encerrada_box_win">
                                <div class="aposta_encerrada_logos_solo">
                                    <img src="${logoFora}" width="60px" height="60px">
                                </div>

                                <div class="aposta_encerrada_nomes">
                                    <div class="nomes_em_linha">
                                        <p>${nomeCasa} vs&nbsp;</p>
                                        <h5>${nomeFora}</h5>
                                    </div>
                                    
                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganho: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Won: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                            `;

                            var y = document.querySelector('.caixas_apostas_encerradas')
                            y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                        }
                        else{//equipa fora perdeu
                            HTML_aposta_encerrada = `
                            <div class="aposta_encerrada_box_loss">
                                <div class="aposta_encerrada_logos_solo">
                                    <img src="${logoFora}" width="60px" height="60px">
                                </div>

                                <div class="aposta_encerrada_nomes">
                                    <div class="nomes_em_linha">
                                        <p>${nomeCasa} vs&nbsp;</p>
                                        <h5>${nomeFora}</h5>
                                    </div>
                                    
                                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                                    <p class="en">(Regular Time Win)</p>

                                    <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                    <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                    <h4 class="pt">Ganho: 0 ${aposta.tipoMoeda}</h4>
                                    <h4 class="en">Won: 0 ${aposta.tipoMoeda}</h4>
                                </div>                
                            </div>
                            `;

                            var y = document.querySelector('.caixas_apostas_encerradas')
                            y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                        }
                    }   
                }
            }
            else{//empate

                if (aposta.estado == 0){//empate ativo
                    let logoCasa = aposta.logos[0]
                    let logoFora = aposta.logos[1]
                    let nomeCasa = aposta.nomes[0]
                    let nomeFora = aposta.nomes[1]

                    HTML_aposta_ativa = `
                        <div class="aposta_ativa_box">
                            <div class="aposta_ativa_logos_empate">
                                <img src="${logoCasa}" width="60px" height="60px">
                                <img src="${logoFora}" width="60px" height="60px">
                            </div>

                            <div class="aposta_ativa_nomes">
                                <div class="nomes_em_linha">
                                    <p>${nomeCasa}</p>
                                    <p>&nbsp;vs ${nomeFora}</p>
                                </div>
                                
                                <p class="pt">(Empate Tempo Regulamentar)</p>
                                <p class="en">(Regular Time Draw)</p>

                                <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                <h4 class="pt">Ganhos Possíveis: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                <h4 class="en">Possible Gains: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                            </div>                
                        </div>
                    `;

                    var y = document.querySelector('.caixas_apostas_ativas')
                    y.insertAdjacentHTML('beforeend', HTML_aposta_ativa);
                }
                else{//empate acabou
                    let logoCasa = aposta.logos[0]
                    let logoFora = aposta.logos[1]
                    let nomeCasa = aposta.nomes[0]
                    let nomeFora = aposta.nomes[1]

                    if (aposta.ganhou == true){//empate ganhou
                        HTML_aposta_encerrada = `
                        <div class="aposta_encerrada_box_win">
                            <div class="aposta_encerrada_logos_empate">
                                <img src="${logoCasa}" width="60px" height="60px">
                                <img src="${logoFora}" width="60px" height="60px">
                            </div>

                            <div class="aposta_encerrada_nomes">
                                <div class="nomes_em_linha">
                                    <p>${nomeCasa}</p>
                                    <p>&nbsp;vs ${nomeFora}</p>
                                </div>
                                
                                <p class="pt">(Empate Tempo Regulamentar)</p>
                                <p class="en">(Regular Time Draw)</p>

                                <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                <h4 class="pt">Ganho: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                                <h4 class="en">Won: ${aposta.ganhos} ${aposta.tipoMoeda}</h4>
                            </div>                
                        </div>
                        `;

                        var y = document.querySelector('.caixas_apostas_encerradas')
                        y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                    }
                    else{//empate perdeu
                        HTML_aposta_encerrada = `
                        <div class="aposta_encerrada_box_loss">
                            <div class="aposta_encerrada_logos_empate">
                                <img src="${logoCasa}" width="60px" height="60px">
                                <img src="${logoFora}" width="60px" height="60px">
                            </div>

                            <div class="aposta_encerrada_nomes">
                                <div class="nomes_em_linha">
                                    <p>${nomeCasa}</p>
                                    <p>&nbsp;vs ${nomeFora}</p>
                                </div>
                                
                                <p class="pt">(Empate Tempo Regulamentar)</p>
                                <p class="en">(Regular Time Draw)</p>

                                <h6 class="pt">Montante Apostado: ${aposta.montante} ${aposta.tipoMoeda}</h6>
                                <h6 class="en">Amount Betted: ${aposta.montante} ${aposta.tipoMoeda}</h6>

                                <h4 class="pt">Ganho: 0 ${aposta.tipoMoeda}</h4>
                                <h4 class="en">Won: 0 ${aposta.tipoMoeda}</h4>
                            </div>                
                        </div>
                        `;

                        var y = document.querySelector('.caixas_apostas_encerradas')
                        y.insertAdjacentHTML('beforeend', HTML_aposta_encerrada);
                    }
                }   
            }      
        }
    }

    document.querySelector('.zona_consultar_historico').style.display = "block";

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}

//fechar caixa historico
function fecharHistorico(){
    document.querySelector('.caixas_apostas_ativas').innerHTML = ""
    document.querySelector('.caixas_apostas_encerradas').innerHTML = ""
    document.querySelector('.zona_consultar_historico').style.display = "none";
}


//caixa para reportar problema
function reportar_problema(){
    document.querySelector('.info_utilizador_opcoes').style.display = "none";
    user_menu = false; 
    document.getElementById("menu_levantar").style.display = "none";
    document.getElementById("menu_depositar").style.display = "none";
    document.querySelector('.zona_converter_moeda').style.display = "none";
    document.querySelector('.zona_consultar_historico').style.display = "none";
    document.querySelector('.zona_reportar_problema').style.display = "block";
}

//submeter problema reportado
async function confirmar_problema(){
    var problema = document.getElementById("caixa_problema").value;
    
    //guardar problema na base de dados
    await eel.guardar_problema(problema)();
    document.getElementById("caixa_problema").value = "";
    document.querySelector('.zona_reportar_problema').style.display = "none";

}

//fechar caixa reportar problemas
function cancelar_reportar(){
    document.getElementById("caixa_problema").value = "";
    document.querySelector('.zona_reportar_problema').style.display = "none";

    try{
        document.querySelector('.alert_problema').remove();
    }catch (ignore) {}
}


/*Menu de depositar*/ 
function abrir_menu_depositar(){
    document.getElementById("menu_levantar").style.display = "none";
    document.getElementById("menu_converter").style.display = "none";
    document.getElementById("menu_reportar_problema").style.display = "none";
    document.getElementById("menu_consultar_historico").style.display = "none";
    document.getElementById("menu_depositar").style.display = "block";
}

async function confirmar_depositar(){

    var montante_depositar = document.getElementById("montante_depositar").value;
    var moeda_depositar = document.getElementById("moeda_depositar").value;
    var num_cartao_credito = document.getElementById("cc_depositar").value;

    if (montante_depositar != ""){
        
        let isnum = /^\d+$/.test(num_cartao_credito);

        if (num_cartao_credito.length == 16 && isnum == true){//cartao é válido
           
            let result = await eel.depositarDinheiro(id_utilizador, num_cartao_credito, parseFloat(montante_depositar), moeda_depositar)()
            
            if (result){//se result = True então tudo correu bem e foi adicionado dinheiro à conta
                
                atualizaSaldo()

                //apagar dados metidos
                document.getElementById("montante_depositar").value = "";
                document.getElementById("cc_depositar").value = "";
                document.getElementById("dd_depositar").value = "";
                document.getElementById("cod_depositar").value = "";
                document.getElementById("moeda_depositar").value = "€";
                document.getElementById("menu_depositar").style.display = "none";

                try{
                    document.querySelector('.alert_depositar').remove();
                }catch (ignore) {}

                if (sessionStorage.getItem("lingua_site") == "pt"){
                    switchPortugal();
                }
                else{
                    switchEnglish();
                }
            }
        }
        else{
            //definir o css desta merda
            HTML_alert_cartao = `
            <div class="alert_cartao">
                <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
                <strong class="pt">Introduza um Número de Cartão de Crédito Válido!</strong>
                <strong class="en">Insert a Valid Credit Card Number!</strong>
            </div>
            `;

            var x = document.querySelector('.depositar-container');
            x.insertAdjacentHTML('afterbegin', HTML_alert_cartao);
        }
    }
    else{
        HTML_alert = `
        <div class="alert_depositar">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
            <strong>Por favor, introduza o montante a depositar!</strong>
        </div>
        `;

        var x = document.querySelector('.depositar-container');
        x.insertAdjacentHTML('afterbegin', HTML_alert);
    }
    
}

function cancelar_depositar(){
    document.getElementById("montante_depositar").value = "";
    document.getElementById("cc_depositar").value = "";
    document.getElementById("dd_depositar").value = "";
    document.getElementById("cod_depositar").value = "";
    document.getElementById("moeda_depositar").value = "€";
    document.getElementById("menu_depositar").style.display = "none";

    try{
        document.querySelector('.alert_depositar').remove();
    }catch (ignore) {}
}

/*Menu de depositar*/ 
function abrir_menu_levantar(){
    document.getElementById("menu_depositar").style.display = "none";
    document.getElementById("menu_converter").style.display = "none";
    document.getElementById("menu_reportar_problema").style.display = "none";
    document.getElementById("menu_consultar_historico").style.display = "none";
    document.getElementById("menu_levantar").style.display = "block";
}


async function confirmar_codigo(){

    let code1 = document.getElementById("code1").value
    let code2 = document.getElementById("code2").value
    let code3 = document.getElementById("code3").value
    let code4 = document.getElementById("code4").value
    var montante_levantar = document.getElementById("montante_levantar").value;
    var moeda_levantar = document.getElementById("moeda_levantar").value;
    var iban = document.getElementById("iban_levantar").value;//acho que não é necessário

    var code = ''.concat(code1, code2, code3, code4)

    let checkmail = await eel.confirmarLevantarDinheiro(id_utilizador, parseInt(code), iban, parseFloat(montante_levantar), moeda_levantar)();
        
    if (checkmail == true){ //se check_mail = True, então tudo correu bem e foi retirado dinheiro da conta

        //ativar botao
        document.getElementById("enviar_codigo").disabled = false;

        atualizaSaldo()
        
        //apagar dados metidos
        let y = document.getElementById("s_code");
        y.remove();

        document.getElementById("cancelar_levantar").style.display = "block"
        document.getElementById("enviar_codigo").style.display = "block"
        document.getElementById("montante_levantar").value = "";
        document.getElementById("iban_levantar").value = "";
        document.getElementById("moeda_levantar").value = "€";
        try{
            document.querySelector('.alert_levantar').remove();
        }catch (ignore){}        
        document.getElementById("menu_levantar").style.display = "none";

        if (sessionStorage.getItem("lingua_site") == "pt"){
            switchPortugal();
        }
        else{
            switchEnglish();
        }
    }else{
        if (sessionStorage.getItem("lingua_site") == "pt"){
            alert('Operação falhou!!')
        }
        else{
            alert('Fail Operation!!')
        }
    }
}

function enviar_codigo(){

    var montante_levantar = document.getElementById("montante_levantar").value;
    var moeda_levantar = document.getElementById("moeda_levantar").value;
    var iban = document.getElementById("iban_levantar").value;
        
    eel.levantarDinheiro(id_utilizador, iban, parseFloat(montante_levantar), moeda_levantar)(auxiliarCodigo);
     
    var d = document.getElementById("levantarDinehiro");
    document.getElementById("cancelar_levantar").style.display = "none"
    document.getElementById("enviar_codigo").style.display = "none"
    
    HTML_code = `
        <div id="s_code">
            <form class="code_section">
                <label for="code_box">
                    <b class="pt">Inserir Código</b>
                    <b class="en">Insert Code</b>
                </label>
                <div class="codigoSeparado" name="code_box">
                    <input id="code1" type="text" placeholder="1 Digit" maxlength="1" required>
                    <p>-</p>
                    <input id="code2" type="text" placeholder="1 Digit" maxlength="1" required>
                    <p>-</p>
                    <input id="code3" type="text" placeholder="1 Digit" maxlength="1" required>
                    <p>-</p>
                    <input id="code4" type="text" placeholder="1 Digit" maxlength="1" required>
                </div>

                <button type="button" class="btn" onclick="confirmar_codigo()">
                    <p class="pt">Confirmar Código</p>
                    <p class="en">Confirm Code</p>
                </button>
                <button id="cancelar_codigo" type="button" class="btn cancel" onclick="cancelar_enviar_codigo()">
                    <p class="pt">Cancelar</p>
                    <p class="en">Cancel</p>
                </button>
            </form>
        </div>
    `;

    d.insertAdjacentHTML('beforeend', HTML_code);

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


function auxiliarCodigo(sucesso){
    
    if(!sucesso){
        cancelar_enviar_codigo()
        cancelar_levantar_dinheiro()

        if (sessionStorage.getItem("lingua_site") == "pt"){
            alert('Saldo insuficiente!!')
        }
        else{
            alert('Insufficient funds!!')
        }
    }
}

function cancelar_levantar_dinheiro(){
    document.getElementById("montante_levantar").value = "";
    document.getElementById("moeda_levantar").value = "€";
    document.getElementById("iban_levantar").value = "";
    document.getElementById("menu_levantar").style.display = "none";
}


function cancelar_enviar_codigo(){
    document.getElementById("montante_levantar").value = "";
    document.getElementById("moeda_levantar").value = "€";
    document.getElementById("iban_levantar").value = "";
    
    let y = document.getElementById("s_code");
        y.remove();
    
    document.getElementById("cancelar_levantar").style.display = "block"
    document.getElementById("enviar_codigo").style.display = "block"
    document.getElementById("menu_levantar").style.display = "none";
}



//Selecionar Futebol
function select_foot(){

    selected_mode = "futebol";

    var x = document.getElementById("btn");
    x.style.left = "0";

    var s = document.getElementsByClassName("secçao_apostas")[0];
    s.style.overflowY = "scroll";

    const elementsF1 = document.getElementsByClassName("box_aposta_f1");
    while(elementsF1.length > 0){
        elementsF1[0].parentNode.removeChild(elementsF1[0]);
    }

    const elementsFoot = document.getElementsByClassName("box_aposta");
    while(elementsFoot.length > 0){
        elementsFoot[0].parentNode.removeChild(elementsFoot[0]);
    }

    const elementsFootLive = document.getElementsByClassName("box_aposta_especial");
    while(elementsFootLive.length > 0){
        elementsFootLive[0].parentNode.removeChild(elementsFootLive[0]);
    }


    atualizarApostas();
}

//Selecionar F1
function select_f1(){

    selected_mode = "f1";

    var x = document.getElementById("btn");
    x.style.left = "50vw";

    var s = document.getElementsByClassName("secçao_apostas")[0];
    s.style.overflowY = "hidden";

    const elementsF1 = document.getElementsByClassName("box_aposta_f1");
    while(elementsF1.length > 0){
        elementsF1[0].parentNode.removeChild(elementsF1[0]);
    }

    const elements = document.getElementsByClassName("box_aposta");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    const elementsAtuais = document.getElementsByClassName("box_aposta_especial");
    while(elementsAtuais.length > 0){
        elementsAtuais[0].parentNode.removeChild(elementsAtuais[0]);
    }

    atualizarApostasF1();
}


function switchEnglish(){

    let i=0;
    let portugal = document.querySelectorAll('.pt');
    let inglaterra = document.querySelectorAll('.en');

    for (i = 0; i < portugal.length; ++i) {
        portugal[i].style.display = "none";
    }

    for (i = 0; i < inglaterra.length; ++i) {
        inglaterra[i].style.display = "block";
    }
    

    let x = document.querySelector('.lng_eng');
    x.style["border"] = "4px solid #00204a";
    x.style["box-shadow"] = "1px 1px 0px #00204a, 2px 2px 0px #00204a, 3px 3px 0px #00204a, 4px 4px 0px #00204a, 5px 5px 0px #00204a, 6px 6px 0px #00204a"
    
    let y = document.querySelector('.lng_pt');
    y.style["border"] = "4px solid rgb(196, 196, 196)";
    y.style["box-shadow"] = "1px 1px 0px rgb(196, 196, 196), 2px 2px 0px rgb(196, 196, 196), 3px 3px 0px rgb(196, 196, 196), 4px 4px 0px rgb(196, 196, 196), 5px 5px 0px rgb(196, 196, 196), 6px 6px 0px rgb(196, 196, 196)"

    let lingua_pretendida = "en";
    sessionStorage.setItem("lingua_site", lingua_pretendida);
}

function switchPortugal(){
    
    let i=0;
    let portugal = document.querySelectorAll('.pt');
    let inglaterra = document.querySelectorAll('.en');

    for (i = 0; i < inglaterra.length; ++i) {
        inglaterra[i].style.display = "none";
    }

    for (i = 0; i < portugal.length; ++i) {
        portugal[i].style.display = "block";
    }

    let x = document.querySelector('.lng_pt');
    x.style.border = "4px solid #00204a";
    x.style["box-shadow"] = "1px 1px 0px #00204a, 2px 2px 0px #00204a, 3px 3px 0px #00204a, 4px 4px 0px #00204a, 5px 5px 0px #00204a, 6px 6px 0px #00204a"
    
    let y = document.querySelector('.lng_eng');
    y.style.border = "4px solid rgb(196, 196, 196)";
    y.style["box-shadow"] = "1px 1px 0px rgb(196, 196, 196), 2px 2px 0px rgb(196, 196, 196), 3px 3px 0px rgb(196, 196, 196), 4px 4px 0px rgb(196, 196, 196), 5px 5px 0px rgb(196, 196, 196), 6px 6px 0px rgb(196, 196, 196)"

    let lingua_pretendida = "pt";
    sessionStorage.setItem("lingua_site", lingua_pretendida);
}