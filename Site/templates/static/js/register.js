sessionStorage.setItem('lingua_site', "pt")

/*login e register*/
function login_menu(){
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");

    x.style.left = "25px";
    y.style.left = "425px";
    z.style.left = "0";

}

function register_menu(){
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");

    x.style.left = "-400px";
    y.style.left = "25px";
    z.style.left = "110px";
}

function menu_apostas(){
    window.location = '/apostas.html';
}


//obter dados da base de dados

///////////////////////////////////////////////////Falta verificar se se trata de um Gestor

//Login utilizador
async function login_utilizador(){

    var username_login = document.getElementById("login_nome").value;
    var password_login = document.getElementById("login_password").value;

    let is_gestor = await eel.isGestor(username_login)();
    console.log(is_gestor);
    
    
    if (is_gestor == true){
        window.location = '/gestor.html';
    }
    /*
    if (username_login == "Gestor"){
        window.location = '/gestor.html';
    }*/
    else{
        //validar se nome e passorw existem na base de dados
        var id_login = await eel.valida_dados_utilizador(username_login, password_login)();
        
        //só avança se for valido
        if (id_login > 0){
            sessionStorage.setItem("idUtilizador", id_login);
            window.location = '/apostas.html';
        }
        else{
            document.getElementById("login_nome").style.color = "red";
        }
    }
}


//Registar utilizador
async function registar_utilizador(){

    var username_register = document.getElementById("register_nome").value;
    var email_register = document.getElementById("register_email").value;
    var password_register = document.getElementById("register_password").value;
    var address_register = document.getElementById("register_address").value;
    var phone_register = document.getElementById("register_phone").value;
    var cc_register = document.getElementById("register_cc").value;
    
    //verificar se já existe o username, email ou cc na base de dados
    var existe_user = await eel.user_repetido(username_register, email_register, cc_register)();

    //se ainda não existir, registar user na base de dados (podia unir as duas funções numa só)
    if (existe_user == 0){

        var novo_id = await eel.registar_user(username_register, email_register, password_register, address_register, phone_register, cc_register)();
        sessionStorage.setItem("idUtilizador", novo_id);
        window.location = '/apostas.html';  
    }
    else{
        document.getElementById("register_nome").style.color = "red";
    }  
}


document.getElementById('login').addEventListener('submit', async function(event){
    login_utilizador();
    event.preventDefault();
});

document.getElementById('register').addEventListener('submit', async function(event){
    registar_utilizador();
    event.preventDefault();
});

function switchEnglish(){

    let i=0;
    let portugal = document.querySelectorAll('.pt');
    let inglaterra = document.querySelectorAll('.en');
    sessionStorage.setItem('lingua_site', "en")

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

}

function switchPortugal(){
    
    let i=0;
    let portugal = document.querySelectorAll('.pt');
    let inglaterra = document.querySelectorAll('.en');
    sessionStorage.setItem('lingua_site', "pt")

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

}
