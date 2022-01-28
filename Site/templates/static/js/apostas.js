var classification_on = false
var listaJogosApostados = []
var listaPilotosApostados = []

//Arredondar valores a 2 casas decimais
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

//Adicionar uma caixa com as equipas que vão jogar e as suas odds
eel.expose(add_aposta_futebol);
function add_aposta_futebol(aposta) {
    var apostas = document.querySelector('.secçao_apostas');

    var dataAtual  = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var diaAtual = dataAtual.getDate();
    var anoAtual = dataAtual.getFullYear();

    var dataProvaFormatada = (aposta.Data).split('-');
    var mesProva = dataProvaFormatada[1];
    var diaProva = dataProvaFormatada[0];
    var anoProva = (dataProvaFormatada[2].split(' '))[0];

    var oddCasa_decimal = parseFloat(aposta.oddCasa).toFixed(2)
    var oddEmpate_decimal = parseFloat(aposta.oddEmpate).toFixed(2)
    var oddFora_decimal = parseFloat(aposta.oddFora).toFixed(2)

    if (diaAtual == diaProva && mesAtual == mesProva && anoAtual == anoProva){

        HTMLNovo = `
        <div class="box_aposta_especial">
            <div class="aposta_data"> 
                <h6 class="campeonatoLiga">${aposta.Competicao} (${aposta.Data})</h6>
                <button onclick='abrirClassificacao(\"${aposta.equipaCasa}\", \"${aposta.equipaFora}\")'><img src="./static/images/standings_symbol.png"></button>
            </div>

            <div class="aposta_equipas">
                <div class="team">
                    <img src="${aposta.logotipoCasa}" alt="image">
                    <h3>${aposta.equipaCasa}</h3>
                </div>

                <h1>VS</h1>

                <div class="team">
                    <img src="${aposta.logotipoFora}" alt="image">
                    <h3>${aposta.equipaFora}</h3>
                </div>
            </div>

            <div class="aposta_odds">

            <a style="cursor: pointer;" onclick='add_aposta_boletim_equipaCasa(\"${aposta.idEvento}\", \"${aposta.idEquipaCasa}\", \"${aposta.equipaCasa}\", \"${aposta.logotipoCasa}\", \"${aposta.equipaFora}\", ${oddCasa_decimal})' class="positive">
                    <span>1</span>
                    ${oddCasa_decimal}
                </a>

                <a style="cursor: pointer;" onclick='add_aposta_boletim_empate(\"${aposta.idEvento}\", "NULL",\"${aposta.equipaCasa}\", \"${aposta.equipaFora}\", \"${aposta.logotipoCasa}\", \"${aposta.logotipoFora}\", ${oddEmpate_decimal})' class="negative">
                    <span>x</span>
                    ${oddEmpate_decimal}
                </a>

                <a style="cursor: pointer;" onclick='add_aposta_boletim_equipaFora(\"${aposta.idEvento}\", \"${aposta.idEquipaFora}\", \"${aposta.equipaFora}\", \"${aposta.logotipoFora}\", \"${aposta.equipaCasa}\", ${oddFora_decimal})' class="positive">
                    <span>2</span>
                    ${oddFora_decimal}
                </a>
            </div>
        </div>
    `;
    
    apostas.insertAdjacentHTML('beforeend', HTMLNovo);
    }
    else{
        if (aposta.oddCasa != 0 && apostas.oddEmpate != 0 && apostas.oddFora != 0){
            HTMLNovo = `
                <div class="box_aposta">
                    <div class="aposta_data"> 
                        <h6 class="campeonatoLiga">${aposta.Competicao} (${aposta.Data})</h6>
                        <button onclick='abrirClassificacao(\"${aposta.equipaCasa}\", \"${aposta.equipaFora}\")'><img src="./static/images/standings_symbol.png"></button>
                    </div>
    
                    <div class="aposta_equipas">
                        <div class="team">
                            <img src="${aposta.logotipoCasa}" alt="image">
                            <h3>${aposta.equipaCasa}</h3>
                        </div>
    
                        <h1>VS</h1>
    
                        <div class="team">
                            <img src="${aposta.logotipoFora}" alt="image">
                            <h3>${aposta.equipaFora}</h3>
                        </div>
                    </div>
    
                    <div class="aposta_odds">
    
                    <a style="cursor: pointer;" onclick='add_aposta_boletim_equipaCasa(\"${aposta.idEvento}\", \"${aposta.idEquipaCasa}\", \"${aposta.equipaCasa}\", \"${aposta.logotipoCasa}\", \"${aposta.equipaFora}\", ${oddCasa_decimal})' class="positive">
                            <span>1</span>
                            ${oddCasa_decimal}
                        </a>
    
                        <a style="cursor: pointer;" onclick='add_aposta_boletim_empate(\"${aposta.idEvento}\", "NULL", \"${aposta.equipaCasa}\", \"${aposta.equipaFora}\", \"${aposta.logotipoCasa}\", \"${aposta.logotipoFora}\", ${oddEmpate_decimal})' class="negative">
                            <span>x</span>
                            ${oddEmpate_decimal}
                        </a>
    
                    <a style="cursor: pointer;" onclick='add_aposta_boletim_equipaFora(\"${aposta.idEvento}\", \"${aposta.idEquipaFora}\", \"${aposta.equipaFora}\", \"${aposta.logotipoFora}\", \"${aposta.equipaCasa}\", ${oddFora_decimal})' class="positive">
                        <span>2</span>
                        ${oddFora_decimal}
                    </a>
                </div>
            </div>
            `;
        
            apostas.insertAdjacentHTML('beforeend', HTMLNovo);
        } 
    }
}

//Ativar Animação de Loading
eel.expose(ativaLoadingAposta);
function ativaLoadingAposta() {
    document.querySelector('.loading').style.display = "flex";
}

//Desativar Animação de Loading
eel.expose(desativaLoadingAposta);
function desativaLoadingAposta() {
    document.querySelector('.loading').style.display = "none";
}

//Carregar apostas Futebol
async function atualizarApostas(){
    //await eel.atualizaAposta()();
    await eel.obter_jogos_da_bd()();
}

//Adicionar caixa onde vão aprecer pilotos de F1
eel.expose(add_aposta_F1);
function add_aposta_F1(race) {
    aposta = race.Dados
    pilotos = aposta.pilotos
    var apostas = document.querySelector('.secçao_apostas');
    HTMLNovo = `
    <div class="box_aposta_f1">
        <div class="f1_data"> 
            <h6 class="campeonatoLiga">${aposta.nome_prova} </h6>
            <h6> ${aposta.data_prova}</h6>
            <button onclick='abrirClassificacaoF1()'><img src="./static/images/standings_symbol.png"></button>
        </div>

        <div class="f1_drivers"></div>

    </div>
`;
   
apostas.insertAdjacentHTML('beforeend', HTMLNovo);
}

//Adicionar caixa com nome nome do piloto e os seus pontos no campeonato
eel.expose(add_f1_driver_box);
function add_f1_driver_box(driver){
    /*aposta = race.Dados*/
    var drivers_boxes = document.querySelector('.f1_drivers');
    let oddAposta = parseFloat(driver.odd).toFixed(2)

    console.log(aposta.idEvento)
    HTMLNovo = `
    <div class="driver_box">
        <div class="driver_info"> 
            <img src="${driver.face}" alt="image">
            <h6> ${driver.name} </h6>
            <a style="cursor: pointer;" onclick='add_aposta_f1_boletim(${aposta.idProva}, ${driver.idPiloto}, \"${driver.face}\", \"${driver.name}\", \"${aposta.nome_prova}\", ${oddAposta})'>
                <span>${oddAposta}</span>
            </a>
        </div>
    </div>
    `;

    drivers_boxes.insertAdjacentHTML('beforeend', HTMLNovo);
}

//Carregar apostas F1
async function atualizarApostasF1(){
    await eel.obter_pilotos_proxima_prova_F1()();
}

atualizarApostas();

//funcao que recarrega apostas
function delete_and_update_apostas(){
    
    if (selected_mode == "futebol"){

        const elements = document.getElementsByClassName("box_aposta");
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }

        const elementsAtuais = document.getElementsByClassName("box_aposta_especial");
        while(elementsAtuais.length > 0){
            elementsAtuais[0].parentNode.removeChild(elementsAtuais[0]);
        }

        atualizarApostas();
    }
}

setInterval(delete_and_update_apostas, 60000)


//Criar caixa com nome da equipa e sua classificacao
eel.expose(classificacao_equipa);
function classificacao_equipa(equipa, equipaCasa, equipaFora){
    var seccao = document.querySelector('.tabela_equipas');
    
    if (equipa.Nome == equipaCasa || equipa.Nome == equipaFora){
        HTMLNovo = `
        <div class="box_classificacao_equipa_especial">
            <div class="box_classificacao_equipa_parte_inicial">
                <h6>${equipa.Posicao}º</h6>
                <img src="${equipa.Logo}">
                <h6>${equipa.Nome}</h6>
            </div>

            <div class="box_classificacao_equipa_parte_final">
                <h6>${equipa.Vitorias}</h6>
                <h6>${equipa.Derrotas}</h6>
                <h6>${equipa.DeltaGolos}</h6>
                <h3>${equipa.Pontos}</h3>
            </div>
        </div>
    `;
    
    seccao.insertAdjacentHTML('beforeend', HTMLNovo);
    }
    else{/*é uma equipa qualquer*/
        HTMLNovo = `
        <div class="box_classificacao_equipa">
            <div class="box_classificacao_equipa_parte_inicial">
                <h6>${equipa.Posicao}º</h6>
                <img src="${equipa.Logo}">
                <h6>${equipa.Nome}</h6>
            </div>

            <div class="box_classificacao_equipa_parte_final">
                <h6>${equipa.Vitorias}</h6>
                <h6>${equipa.Derrotas}</h6>
                <h6>${equipa.DeltaGolos}</h6>
                <h3>${equipa.Pontos}</h3>
            </div>
        </div>
    `;
    
    seccao.insertAdjacentHTML('beforeend', HTMLNovo);
    }
}

//Abrir caixa de classificação Futebol
async function abrirClassificacao(equipaCasa, equipaFora){
    document.querySelector('.Classificacao').style.display = "inline";

    await eel.adiciona_classificacao_equipa(equipaCasa, equipaFora)
};


//Criar caixa com nome da equipa e sua classificacao
eel.expose(classificacao_F1);
function classificacao_F1(piloto){
    var seccao = document.querySelector('.tabela_equipasF1');
    
    let points = parseFloat(piloto.pontos).toFixed(1);
    HTMLNovo = `
    <div class="box_classificacao_equipaF1">
        <div class="box_classificacao_equipa_parte_inicialF1">
            <h6>${piloto.posicao}º</h6>
            <img src="${piloto.logoURL}">
            <h6>${piloto.nome}</h6>
        </div>

        <div class="box_classificacao_equipa_parte_finalF1">
            <h6>${points}</h6>
        </div>
    </div>
`;

seccao.insertAdjacentHTML('beforeend', HTMLNovo);
    
}

//Abrir caixa da classificacao F!
async function abrirClassificacaoF1(){
    document.querySelector('.ClassificacaoF1').style.display = "inline";

    await eel.adiciona_classificacao_F1()
};

//Fechar caixa de classificação Futebol
function fecharVerClassi() {
    document.querySelector('.Classificacao').style.display = "none";

    var classification = document.getElementsByClassName("tabela_equipas")[0];
    classification.innerHTML = ""
}

//Fechar caixa de classificação Futebol
function fecharVerClassiF1() {
    document.querySelector('.ClassificacaoF1').style.display = "none";

    var classification = document.getElementsByClassName("tabela_equipasF1")[0];
    classification.innerHTML = ""
}

