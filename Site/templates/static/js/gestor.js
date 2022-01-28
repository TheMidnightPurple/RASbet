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

async function load_problems(){

    //validar se nome e passorw existem na base de dados
    var problems = await eel.getReportedProblems()();

    for (var i=0; i<problems.length; i++){

        var data = String(problems[i].Data);
        var text = String(problems[i].Problema);
        var seccao = document.querySelector('.reports_made');

        HTMLNovo = `
        <div class="problema">
            <div class="data_problema">
                <h3 class="pt">Data</h3>
                <h3 class="en">Date</h3>                
                <p>${data}</p>
            </div>
            
            <div class="text_problema">
                <h3 class="pt">Informação Reportada</h3>
                <h3 class="en">Report</h3>                
                <p>${text}</p>
            </div>
        </div>
        `;
        
        seccao.insertAdjacentHTML('beforeend', HTMLNovo);
    }
}

function exitGestor(){
    window.location = '/';
}

load_problems();
