var tipo_e_montante = {}//para cada moeda, saber quanto se apostou no total
var tipo_e_ganho = {}//para cada moeda, sbaer quanto se pode ganhar

var evento_jogo_info = {}

//Adicionar uma aposta de vitoria da equipa de casa ao boletim(nova)
async function add_aposta_boletim_equipaCasa(idEvento, idEquipaVence, nome, simbolo, nomePerde, odd){
    
    var boletim = document.querySelector('.boletim_jogos');

    let identificadorInputApostaBoletim = "input".concat(idEvento);
    let mp= "moeda";
    let moedaPartida = mp.concat(idEvento);

    let oddAposta = parseFloat(odd).toFixed(2)

    if (!listaJogosApostados.includes(idEvento)){

        listaJogosApostados.push(idEvento);

        HTMLNovo = `
        <div id='${idEvento}' class="aposta_escolhida">
            <div class="remove_aposta">
                <img src="./static/images/x.png" onclick='apaga_aposta_futebol_boletim(\"${idEvento}\")'>
            </div>

            <div class="info_aposta">
                <img src="${simbolo}" width="70px" height="70px">
                <div class="info_aposta_nomes">
                    <h5>${nome}</h5>
                    <p>${nomePerde}</p>
                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                    <p class="en">(Regular Time Win)</p>
                </div>
            </div>

            <div class="info_aposta">
                <h6 class="pt">Cota:</h6>
                <h6 class="en">Odd:</h6>
                <h6>${oddAposta}</h6>
                <input id='${identificadorInputApostaBoletim}' placeholder=" Montante (Ex.: 10.98)">
                <div class="selecionar_moeda">
                    <select name="tipo_moeda" id='${moedaPartida}'>
                        <option value="€">€</option>
                        <option value="$">$</option>
                        <option value="£">£</option>
                        <option value="ADA">ADA</option>
                    </select>
                </div>
                <button onclick="confirmInput(${idEvento}, ${idEquipaVence}, \'${moedaPartida}\', \'${identificadorInputApostaBoletim}\', ${oddAposta})"><img src="./static/images/check.png"></button>
            </div>

        </div>
        `;
        
        boletim.insertAdjacentHTML('beforeend', HTMLNovo);
    }

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


//Adicionar uma aposta de vitoria da equipa de fora ao boletim
async function add_aposta_boletim_equipaFora(idEvento, idEquipaVence, nome, simbolo, nomeCasa, odd){
    
    var boletim = document.querySelector('.boletim_jogos');

    let identificadorInputApostaBoletim = "input".concat(idEvento);
    let mp= "moeda";
    let moedaPartida = mp.concat(idEvento);

    let oddAposta = parseFloat(odd).toFixed(2)

    if (!listaJogosApostados.includes(idEvento)){

        listaJogosApostados.push(idEvento);

        HTMLNovo = `
        <div id='${idEvento}' class="aposta_escolhida">
            <div class="remove_aposta">
                <img src="./static/images/x.png" onclick='apaga_aposta_futebol_boletim(\"${idEvento}\")'>
            </div>

            <div class="info_aposta">
                <img src="${simbolo}" width="70px" height="70px">
                <div class="info_aposta_nomes">
                    <p>${nomeCasa}</p>
                    <h5>${nome}</h5>
                    <p class="pt">(Vitória Tempo Regulamentar)</p>
                    <p class="en">(Regular Time Win)</p>
                </div>
            </div>

            <div class="info_aposta">
                <h6 class="pt">Cota:</h6>
                <h6 class="en">Odd:</h6>
                <h6>${oddAposta}</h6>
                <input id='${identificadorInputApostaBoletim}' placeholder=" Montante (Ex.: 10.98)">
                <div class="selecionar_moeda">
                    <select name="tipo_moeda" id='${moedaPartida}'>
                        <option value="€">€</option>
                        <option value="$">$</option>
                        <option value="£">£</option>
                        <option value="ADA">ADA</option>
                    </select>
                </div>
                <button onclick="confirmInput(${idEvento}, \'${idEquipaVence}\',\'${moedaPartida}\', \'${identificadorInputApostaBoletim}\', ${oddAposta})"><img src="./static/images/check.png"></button>
            </div>
        </div>
        `;
        boletim.insertAdjacentHTML('beforeend', HTMLNovo);
    }

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


//Adicionar uma aposta de empate ao boletim
async function add_aposta_boletim_empate(idEvento, idEquipaVence, nomeCasa, nomeFora, simboloCasa, simboloFora, odd){
    
    var boletim = document.querySelector('.boletim_jogos');

    let identificadorInputApostaBoletim = "input".concat(idEvento);
    let mp= "moeda";
    let moedaPartida = mp.concat(idEvento);

    let oddAposta = parseFloat(odd).toFixed(2)

    if (!listaJogosApostados.includes(idEvento)){

        listaJogosApostados.push(idEvento);

        HTMLNovo = `
        <div id='${idEvento}' class="aposta_escolhida">
            <div class="remove_aposta">
                <img src="./static/images/x.png" onclick='apaga_aposta_futebol_boletim(\"${idEvento}\")'>
            </div>

            <div class="info_aposta">
                <img src="${simboloCasa}" width="70px" height="70px">
                <img src="${simboloFora}" width="70px" height="70px">
                <div class="info_aposta_nomes">
                    <p>${nomeCasa}</p>
                    <p>${nomeFora}</p>
                    <p class="pt">(Empate Tempo Regulamentar)</p>
                    <p class="en">(Regular Time Draw)</p>
                </div>
            </div>

            <div class="info_aposta">
                <h6 class="pt">Cota:</h6>
                <h6 class="en">Odd:</h6>
                <h6>${oddAposta}</h6>
                <input id='${identificadorInputApostaBoletim}' placeholder=" Montante (Ex.: 10.98)">
                <div class="selecionar_moeda">
                    <select name="tipo_moeda" id='${moedaPartida}'>
                        <option value="€">€</option>
                        <option value="$">$</option>
                        <option value="£">£</option>
                        <option value="ADA">ADA</option>
                    </select>
                </div>
                <button onclick="confirmInput(${idEvento}, \'${idEquipaVence}\', \'${moedaPartida}\', \'${identificadorInputApostaBoletim}\', ${oddAposta})"><img src="./static/images/check.png"></button>
            </div>
        </div>
        `;
        boletim.insertAdjacentHTML('beforeend', HTMLNovo);
    }

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


//Adicionar uma aposta de F1 ao boletim de apostas
async function add_aposta_f1_boletim(idEvento, idVencedor, face, nome, nome_prova, odd){

    var boletim = document.querySelector('.boletim_jogos');

    let identificadorInputPilotoBoletim = "input".concat(idEvento);
    let mp= "moeda";
    let moedaPartida = mp.concat(idEvento);

    if (listaPilotosApostados.length == 0){//se ainda não apostou em nenhum piloto

        listaPilotosApostados.push(idEvento);

        HTMLNovo = `
        <div id='${idEvento}' class="aposta_escolhida">
            <div class="remove_aposta">
                <img src="./static/images/x.png" onclick='apaga_aposta_f1_boletim(\"${idEvento}\")'>
            </div>

            <div class="info_aposta">
                <div class="boletim_cara_piloto">
                    <img src="${face}">
                </div>
                <div class="boletim_info_piloto">
                    <div class="boletim_piloto_vencedor">
                        <h3>${nome}</h3>
                        <p class="pt">&nbsp;(Vencedor ${nome_prova})</p>
                        <p class="en">&nbsp;(WInner of ${nome_prova})</p>
                    </div>
                    <div class="info_aposta">
                        <h6 class="pt">Cota:</h6>
                        <h6 class="en">Odd:</h6>
                        <h6>${odd}</h6>
                        <input id='${identificadorInputPilotoBoletim}' placeholder=" Montante (Ex.: 10.98)">
                        <div class="selecionar_moeda">
                            <select name="tipo_moeda" id='${moedaPartida}'>
                                <option value="€">€</option>
                                <option value="$">$</option>
                                <option value="£">£</option>
                                <option value="ADA">ADA</option>
                            </select>
                        </div>
                        <button onclick="confirmInput(${idEvento}, \'${idVencedor}\', \'${moedaPartida}\', \'${identificadorInputPilotoBoletim}\', ${odd})"><img src="./static/images/check.png"></button>
                    </div>
                </div>                
            </div>
        </div>
        `;

        boletim.insertAdjacentHTML('beforeend', HTMLNovo);
    }

    if (sessionStorage.getItem("lingua_site") == "pt"){
        switchPortugal();
    }
    else{
        switchEnglish();
    }
}


//Apagar aposta de Futebol do boletim
function apaga_aposta_futebol_boletim(idEvento){

    var elem = document.getElementById(idEvento);

    if (evento_jogo_info[idEvento]){//se partida já tiver valor de aposta

        var moeda_da_qual_remover = evento_jogo_info[idEvento][1];
        var montante_a_remover = evento_jogo_info[idEvento][2];
        var ganho_a_remover = roundToTwo(evento_jogo_info[idEvento][2] * evento_jogo_info[idEvento][3]);

        var id_montante = moeda_da_qual_remover.concat('id_montante');
        var id_ganho = moeda_da_qual_remover.concat('id_ganho');

        var montante_antigo = tipo_e_montante[moeda_da_qual_remover];
        var montante_antigo_update = roundToTwo(montante_antigo - montante_a_remover);
        tipo_e_montante[moeda_da_qual_remover] = montante_antigo_update;

        var ganho_antigo = tipo_e_ganho[moeda_da_qual_remover];
        var ganho_antigo_update = roundToTwo(ganho_antigo - ganho_a_remover);
        tipo_e_ganho[moeda_da_qual_remover] = ganho_antigo_update;

        elem.remove();

        if (montante_antigo_update != 0){//há mais valores na mesma moeda
            
            money_montante = document.getElementById(id_montante);
            money_ganho = document.getElementById(id_ganho);

            HTMLNovo_montantes = `
                <h3>&nbsp;${montante_antigo_update}${moeda_da_qual_remover}&nbsp;</h3>
            `;    
            HTMLNovo_ganhos = `
                <h2>&nbsp;${ganho_antigo_update}${moeda_da_qual_remover}&nbsp;</h2>
            `;    

            money_montante.innerHTML = HTMLNovo_montantes;
            money_ganho.innerHTML = HTMLNovo_ganhos;
        }
        else{//se ficar a 0
            money_montante = document.getElementById(id_montante);
            money_ganho = document.getElementById(id_ganho);
            delete tipo_e_montante[moeda_da_qual_remover];

            money_montante.remove();
            money_ganho.remove();
        }
        
        //apagar aposta da lista de apostas
        delete evento_jogo_info[idEvento];
        
        const index = listaJogosApostados.indexOf(idEvento);
        listaJogosApostados.splice(index, 1);
    }
    else{//se não houver input
        elem.parentNode.removeChild(elem);

        const index = listaJogosApostados.indexOf(idEvento);
        listaJogosApostados.splice(index, 1);
    }
}

//Apagar aposta de Futebol do boletim
function apaga_aposta_f1_boletim(idEvento){

    var elem = document.getElementById(idEvento);

    if (evento_jogo_info[idEvento]){//se piloto já tiver valor de aposta

        var moeda_da_qual_remover = evento_jogo_info[idEvento][1];
        var montante_a_remover = evento_jogo_info[idEvento][2];
        var ganho_a_remover = roundToTwo(evento_jogo_info[idEvento][2] * evento_jogo_info[idEvento][3]);

        var id_montante = moeda_da_qual_remover.concat('id_montante');
        var id_ganho = moeda_da_qual_remover.concat('id_ganho');

        var montante_antigo = tipo_e_montante[moeda_da_qual_remover];
        var montante_antigo_update = montante_antigo - montante_a_remover;
        tipo_e_montante[moeda_da_qual_remover] = montante_antigo_update;

        var ganho_antigo = tipo_e_ganho[moeda_da_qual_remover];
        var ganho_antigo_update = ganho_antigo - ganho_a_remover;
        tipo_e_ganho[moeda_da_qual_remover] = ganho_antigo_update;

        elem.remove();

        if (montante_antigo_update != 0){//há mais valores na mesma moeda
            
            money_montante = document.getElementById(id_montante);
            money_ganho = document.getElementById(id_ganho);

            HTMLNovo_montantes = `
                <h3>&nbsp;${montante_antigo_update}${moeda_da_qual_remover}&nbsp;</h3>
            `;    
            HTMLNovo_ganhos = `
                <h2>&nbsp;${ganho_antigo_update}${moeda_da_qual_remover}&nbsp;</h2>
            `;    

            money_montante.innerHTML = HTMLNovo_montantes;
            money_ganho.innerHTML = HTMLNovo_ganhos;
        }
        else{//se ficar a 0
            money_montante = document.getElementById(id_montante);
            money_ganho = document.getElementById(id_ganho);
            delete tipo_e_montante[moeda_da_qual_remover];

            money_montante.remove();
            money_ganho.remove();
        }
        
        //apagar aposta da lista de apostas
        delete evento_jogo_info[idEvento];
        
        const index = listaPilotosApostados.indexOf(idEvento);
        listaPilotosApostados.splice(index, 1);
    }
    else{//se não houver input
        elem.parentNode.removeChild(elem);

        const index = listaPilotosApostados.indexOf(idEvento);
        listaPilotosApostados.splice(index, 1);
    }
}

/*
//Confirmar boletim e limpar apostas que lá estavam(caso valores sejam inferiores ao saldo)
function confirmar_boletim(){

    if (tipo_e_montante){//caso o boletim tivesse apostas

        for (const [key, value] of Object.entries(tipo_e_montante)) {
            
            if (value <= moedas[key]){//se tivermos saldo suficiente para fazer as apostas
                
                //atualizar o nosso saldo
                var temp = moedas[key];
                moedas[key] = temp - value;

                //Eliminar boxes do boletim
                for (const [jog, vals] of Object.entries(jogo_tipo_montante)){
                    console.log(jog)
                    var x = document.getElementById(jog);
                    x.remove();
                }

                //limpar jogos e pilotos apostados
                listaJogosApostados = [];
                listaPilotosApostados = [];

                //atualizar montantes e ganhos dos jogos apostados
                for (const [a,b] of Object.entries(jogo_tipo_montante)){
                    delete jogo_tipo_montante[a];
                    delete jogo_tipo_ganho[a];
                }

                //apagar todas os montantes de cada moeda
                for (const [c,d] of Object.entries(tipo_e_montante)){
                    delete tipo_e_montante[c];
                    delete tipo_e_ganho[c];
                }

                //Inserir HTMLS novos necessários
                //montantes e ganhos boletim
                HTML_boletim = `
                <div class="boletim_montantes">
                    <h3>Montante a pagar:</h3>
                </div>
                <div class="boletim_ganhos">
                    <h2>Ganhos Possíveis:</h2>
                </div>
                `
                var docM = document.querySelector('.boletim_pagamento');
                docM.innerHTML = HTML_boletim;

                var docS = document.getElementById("saldo_euros_inicial");
                saldo = moedas["€"]

                HTML_saldo = `
                    <h5>${saldo} €</h5>
                `;

                docS.innerHTML = HTML_saldo;
            }
            else{
                HTML_alert = `
                <div class="alert">
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
                    <strong>Saldo Insuficiente!</strong>
                </div>
                `;

                var x = document.querySelector('.boletim_pagamento');
                x.insertAdjacentHTML('afterbegin', HTML_alert);
            }
        }
    }
}*/

//Confirmar valor inserido no montante a apostar de uma aposta
function confirmInput(idEv, idVence, m, identifierInput, odd) {

    if (evento_jogo_info[idEv] == undefined){//ainda não foi inserido input nenhum antes

        montanteInseridoText = document.getElementById(identifierInput).value;
        
        if (montanteInseridoText && !montanteInseridoText.includes(",") && parseFloat(montanteInseridoText) > 0.00){//se o campo de input não está vazio

            tipo_moeda = document.getElementById(m).value;//saber qual a moeda que selecionou para apostar
            var quantidade_maxima = moedas[tipo_moeda];

            if (parseFloat(montanteInseridoText) <= parseFloat(quantidade_maxima)){//se a quantidade é válida (tem de ir mudando)

                if (!tipo_e_montante[tipo_moeda]){//ainda não tinha feito apostas naquela moeda

                    var id_montante = tipo_moeda.concat('id_montante');
                    var id_ganho = tipo_moeda.concat('id_ganho');

                    tipo_e_montante[tipo_moeda] = roundToTwo(montanteInseridoText);
                    tipo_e_ganho[tipo_moeda] = roundToTwo(odd*montanteInseridoText);

                    money_montante = document.querySelector('.boletim_montantes');
                    money_ganho = document.querySelector('.boletim_ganhos');

                    HTMLNovo_montantes = `
                        <div id='${id_montante}'>
                            <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                        </div>
                    `;    
                    HTMLNovo_ganhos = `
                        <div id='${id_ganho}'>
                            <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                        </div>
                    `;    

                    money_montante.insertAdjacentHTML('beforeend', HTMLNovo_montantes);
                    money_ganho.insertAdjacentHTML('beforeend', HTMLNovo_ganhos);

                }
                else{//já tinha feito apostas nessa moeda

                    var id_montante = tipo_moeda.concat('id_montante');
                    var id_ganho = tipo_moeda.concat('id_ganho');

                    var temp1 = tipo_e_montante[tipo_moeda];
                    tipo_e_montante[tipo_moeda] = roundToTwo(temp1 + roundToTwo(montanteInseridoText));
                    
                    var temp2 = tipo_e_ganho[tipo_moeda];
                    tipo_e_ganho[tipo_moeda] = roundToTwo(temp2 + roundToTwo(odd*montanteInseridoText));

                    money_montante = document.getElementById(id_montante);
                    money_ganho = document.getElementById(id_ganho);

                    HTMLNovo_montantes = `
                        <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                    `;    
                    HTMLNovo_ganhos = `
                        <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                    `;    

                    money_montante.innerHTML = HTMLNovo_montantes;
                    money_ganho.innerHTML = HTMLNovo_ganhos;
                }
                
                evento_jogo_info[idEv] = [id_utilizador, tipo_moeda, roundToTwo(montanteInseridoText), odd, idVence]
            }
        }
    }

    else{//já foi inserido input e pode ter metido outro valor diferente
        
        montanteInseridoText = document.getElementById(identifierInput).value;//montante novo inserido

        if (montanteInseridoText && !montanteInseridoText.includes(",") && parseFloat(montanteInseridoText) > 0.00){//se o campo input não está vazio

            tipo_moeda = document.getElementById(m).value;
            var quantidade_maxima = moedas[tipo_moeda];

            if (parseFloat(montanteInseridoText) <= parseFloat(quantidade_maxima)){//se calhar pode-se tirar

                var moeda_antiga = evento_jogo_info[idEv][1];

                if (moeda_antiga == tipo_moeda){//não se mudou a moeda

                    if (!tipo_e_montante[tipo_moeda]){//ainda não tinha feito apostas naquela moeda

                        var id_montante = tipo_moeda.concat('id_montante');
                        var id_ganho = tipo_moeda.concat('id_ganho');

                        tipo_e_montante[tipo_moeda] = roundToTwo(montanteInseridoText);
                        tipo_e_ganho[tipo_moeda] = roundToTwo(odd*montanteInseridoText);
                        
                        evento_jogo_info[idEv] = [id_utilizador, tipo_moeda, roundToTwo(montanteInseridoText), odd, idVence]

                        money_montante = document.querySelector('.boletim_montantes');
                        money_ganho = document.querySelector('.boletim_ganhos');

                        HTMLNovo_montantes = `
                            <div id='${id_montante}'>
                                <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                            </div>
                        `;    
                        HTMLNovo_ganhos = `
                            <div id='${id_ganho}'>
                                <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                            </div>
                        `;    

                        money_montante.insertAdjacentHTML('beforeend', HTMLNovo_montantes);
                        money_ganho.insertAdjacentHTML('beforeend', HTMLNovo_ganhos);

                    }

                    else{//já tinha feito apostas nessa moeda

                        var id_montante = tipo_moeda.concat('id_montante');
                        var id_ganho = tipo_moeda.concat('id_ganho');
                        

                        montanteAnterior = evento_jogo_info[idEv][2];//obter montante antigo
                        montanteSemAnterior = tipo_e_montante[tipo_moeda] - montanteAnterior;
                        tipo_e_montante[tipo_moeda] = roundToTwo(montanteSemAnterior + roundToTwo(montanteInseridoText));
                        
                        ganhoAnterior = roundToTwo(evento_jogo_info[idEv][2] * evento_jogo_info[idEv][3]);
                        ganhoSemAnterior = tipo_e_ganho[tipo_moeda] - ganhoAnterior;
                        tipo_e_ganho[tipo_moeda] = roundToTwo(ganhoSemAnterior + roundToTwo(odd*montanteInseridoText));

                        evento_jogo_info[idEv] = [id_utilizador, tipo_moeda, roundToTwo(montanteInseridoText), odd, idVence]
                        
                        money_montante = document.getElementById(id_montante);
                        money_ganho = document.getElementById(id_ganho);

                        HTMLNovo_montantes = `
                            <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                        `;    
                        HTMLNovo_ganhos = `
                            <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                        `;    

                        money_montante.innerHTML = HTMLNovo_montantes;
                        money_ganho.innerHTML = HTMLNovo_ganhos;

                    }
                }

                else{//se mudou de moeda 

                    if (!tipo_e_montante[tipo_moeda]){//ainda não tinha feito apostas naquela moeda

                        var id_montante_antigo = moeda_antiga.concat('id_montante');
                        var id_ganho_antigo = moeda_antiga.concat('id_ganho');

                        var id_montante = tipo_moeda.concat('id_montante');
                        var id_ganho = tipo_moeda.concat('id_ganho');

                        montante_antigo_update = roundToTwo(tipo_e_montante[moeda_antiga] - evento_jogo_info[idEv][2]);
                        ganho_antigo_update = roundToTwo(tipo_e_ganho[moeda_antiga] - roundToTwo(evento_jogo_info[idEv][2] * evento_jogo_info[idEv][3]));

                        tipo_e_montante[tipo_moeda] = roundToTwo(montanteInseridoText);
                        tipo_e_ganho[tipo_moeda] = roundToTwo(odd*montanteInseridoText);

                        evento_jogo_info[idEv] = [id_utilizador, tipo_moeda, roundToTwo(montanteInseridoText), odd, idVence]
                                                
                        //atualizar antigo
                                        
                        if (montante_antigo_update == 0){
                            money_montante_antigo = document.getElementById(id_montante_antigo);
                            money_ganho_antigo = document.getElementById(id_ganho_antigo);

                            money_montante_antigo.parentNode.removeChild(money_montante_antigo);
                            money_ganho_antigo.parentNode.removeChild(money_ganho_antigo);

                            delete tipo_e_montante[moeda_antiga];
                            delete tipo_e_ganho[moeda_antiga];

                        }
                        else{
                            money_montante_antigo = document.getElementById(id_montante_antigo);
                            money_ganho_antigo = document.getElementById(id_ganho_antigo);

                            HTMLNovo_montantes_antigos = `
                                <h3>&nbsp;${montante_antigo_update} ${moeda_antiga}&nbsp;</h3>
                            `;    
                            HTMLNovo_ganhos_antigos = `
                                <h2>&nbsp;${ganho_antigo_update} ${moeda_antiga}&nbsp;</h2>
                            `;    

                            money_montante_antigo.innerHTML = HTMLNovo_montantes_antigos;
                            money_ganho_antigo.innerHTML = HTMLNovo_ganhos_antigos;

                            tipo_e_montante[moeda_antiga] = montante_antigo_update;
                            tipo_e_ganho[moeda_antiga] = ganho_antigo_update;
                        }

                        //atualizar novo
                        money_montante = document.querySelector('.boletim_montantes');
                        money_ganho = document.querySelector('.boletim_ganhos');

                        HTMLNovo_montantes = `
                            <div id='${id_montante}'>
                                <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                            </div>
                        `;    
                        HTMLNovo_ganhos = `
                            <div id='${id_ganho}'>
                                <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                            </div>
                        `;    

                        money_montante.insertAdjacentHTML('beforeend', HTMLNovo_montantes);
                        money_ganho.insertAdjacentHTML('beforeend', HTMLNovo_ganhos);
                    }

                    else{//já tinha feito apostas naquela moeda

                        var id_montante_antigo = moeda_antiga.concat('id_montante');
                        var id_ganho_antigo = moeda_antiga.concat('id_ganho');

                        var id_montante = tipo_moeda.concat('id_montante');
                        var id_ganho = tipo_moeda.concat('id_ganho');

                        montante_antigo_update = roundToTwo(tipo_e_montante[moeda_antiga] - evento_jogo_info[idEv][2]);
                        montante_antigo_update = roundToTwo(tipo_e_montante[moeda_antiga] - roundToTwo(evento_jogo_info[idEv][2] * evento_jogo_info[idEv][3]));

                        montanteSemAnterior = tipo_e_montante[tipo_moeda];
                        tipo_e_montante[tipo_moeda] = roundToTwo(montanteSemAnterior + roundToTwo(montanteInseridoText));

                        ganhoSemAnterior = tipo_e_ganho[tipo_moeda];
                        tipo_e_ganho[tipo_moeda] = roundToTwo(ganhoSemAnterior + roundToTwo(odd*montanteInseridoText));

                        evento_jogo_info[idEv] = [id_utilizador, tipo_moeda, roundToTwo(montanteInseridoText), odd, idVence]
                    
                        //atualizar antigo
                        if (montante_antigo_update == 0){
                            money_montante_antigo = document.getElementById(id_montante_antigo);
                            money_ganho_antigo = document.getElementById(id_ganho_antigo);

                            money_montante_antigo.parentNode.removeChild(money_montante_antigo);
                            money_ganho_antigo.parentNode.removeChild(money_ganho_antigo);
                            
                            delete tipo_e_montante[moeda_antiga];
                            delete tipo_e_ganho[moeda_antiga];
                        }
                        else{
                            money_montante_antigo = document.getElementById(id_montante_antigo);
                            money_ganho_antigo = document.getElementById(id_ganho_antigo);

                            HTMLNovo_montantes_antigos = `
                                <h3>&nbsp;${montante_antigo_update} ${moeda_antiga}&nbsp;</h3>
                            `;    
                            HTMLNovo_ganhos_antigos = `
                                <h2>&nbsp;${ganho_antigo_update} ${moeda_antiga}&nbsp;</h2>
                            `;    

                            money_montante_antigo.innerHTML = HTMLNovo_montantes_antigos;
                            money_ganho_antigo.innerHTML = HTMLNovo_ganhos_antigos;

                            tipo_e_montante[moeda_antiga] = montante_antigo_update;
                            tipo_e_ganho[moeda_antiga] = ganho_antigo_update;
                        }
                        //atualizar novo
                        money_montante = document.getElementById(id_montante);
                        money_ganho = document.getElementById(id_ganho);

                        HTMLNovo_montantes = `
                            <h3>&nbsp;${tipo_e_montante[tipo_moeda]} ${tipo_moeda}&nbsp;</h3>
                        `;    
                        HTMLNovo_ganhos = `
                            <h2>&nbsp;${tipo_e_ganho[tipo_moeda]} ${tipo_moeda}&nbsp;</h2>
                        `;    

                        money_montante.innerHTML = HTMLNovo_montantes;
                        money_ganho.innerHTML = HTMLNovo_ganhos;

                    }
                }
            }
        }
    }
}



//Confirmar boletim e limpar apostas que lá estavam(caso valores sejam inferiores ao saldo)
async function confirmar_boletim_2(){

    if (tipo_e_montante){//caso o boletim tivesse apostas

        for (const [key, value] of Object.entries(tipo_e_montante)) {
            
            if (value <= moedas[key]){//se tivermos saldo suficiente para fazer as apostas
                
                //registar aposta na base de dados
                for (const [jog, vals] of Object.entries(evento_jogo_info)){
                    
                    console.log(jog)
                    console.log(vals)
                    await eel.regista_aposta_realizada_bd(jog, vals[0], vals[1], vals[2], vals[3], vals[4])()     
                    
                    //Eliminar boxes do boletim
                    var x = document.getElementById(jog);
                    x.remove();
                }

                atualizaSaldo();

                //limpar jogos e pilotos apostados
                listaJogosApostados = [];
                listaPilotosApostados = [];

                //atualizar montantes e ganhos dos jogos apostados
                for (const [a,b] of Object.entries(evento_jogo_info)){
                    delete evento_jogo_info[a];
                }

                //apagar todas os montantes de cada moeda
                for (const [c,d] of Object.entries(tipo_e_montante)){
                    delete tipo_e_montante[c];
                    delete tipo_e_ganho[c];
                }

                //Inserir HTMLS novos necessários
                //montantes e ganhos boletim
                HTML_boletim = `
                <div class="boletim_montantes">
                    <h3 class="pt">Montante a pagar:</h3>
                    <h3 class="en">Betting Amount:</h3>
                </div>
                <div class="boletim_ganhos">
                    <h2 class="pt">Ganhos Possíveis:</h2>
                    <h2 class="en">Possible Gains:</h2>
                </div>
                `
                var docM = document.querySelector('.boletim_pagamento');
                docM.innerHTML = HTML_boletim;

                var docS = document.querySelector('.saldo_valor');
                saldo = roundToTwo(moedas[moeda_atual])

                HTML_saldo = `
                    <h6 class="pt">Saldo: </h6>
                    <h6 class="en">Balance: </h6>
                    <h5>${saldo} ${moeda_atual}</h5>
                `;

                docS.innerHTML = HTML_saldo;
            }
            else{
                HTML_alert = `
                <div class="alert">
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
                    <strong class="pt">Saldo Insuficiente!</strong>
                    <strong class="en">Insuficient Balance!</strong>
                </div>
                `;

                var x = document.querySelector('.boletim_pagamento');
                x.insertAdjacentHTML('afterbegin', HTML_alert);
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