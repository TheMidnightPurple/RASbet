document.getElementById('depositarDinehiro').addEventListener('submit', async function(event){
    confirmar_depositar()
    event.preventDefault();
});

document.getElementById('levantarDinehiro').addEventListener('submit', async function(event){
    enviar_codigo();
    event.preventDefault();
});

document.getElementById('conv_money').addEventListener('submit', async function(event){
    confirmar_converter();
    event.preventDefault();
});

document.getElementById('rep_prob').addEventListener('submit', async function(event){
    confirmar_problema();
    event.preventDefault();
});