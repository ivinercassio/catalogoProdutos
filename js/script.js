var api = "https://api-odinline.odiloncorrea.com/";

// index page
$(document).ready(function() {
    $('#price').mask("#,##0.00", {reverse: true});

    $("#form1").validate({
        rules: {
          login: { required: true },
          password: { required: true }
        },
        messages: {
          login: { required: "Campo obrigatório" },
          password: { required: "Campo obrigatório" }
        }
    });

    $("#form2").validate({
        rules: {
            product: { required: true },
            price: { required: true, min: 0},
            action: { required: true },
        },
        messages: {
            product: { required: "Campo obrigatório" },
            price: { required: "Campo obrigatório", min: "Valor inválido" },
            action: { required: "Campo obrigatório" },
        }
    });
});

async function logar() {
    if ($("#form1").valid()) {
        let login = $("#login").val();
        let password = $("#password").val();
        let link = api + "usuario/" + login + "/" + password + "/autenticar";
        
        const response = await fetch(link)
        .then( async data => {
            let result = await data.json();
            if (result != null && result != "{}"){
                localStorage.setItem("userLogado", JSON.stringify(result));
                window.location.href = "home.html";
            }else
                alert("Usuário ou senha incorretos");

        }).catch( error => {
            console.error("API error: " + error);
        });
    } 
}

// all pages
function logout() {
    if(localStorage.getItem("userLogado")) 
        localStorage.removeItem("userLogado");
}

function alertsController() {
    if (localStorage.getItem("alerts") && localStorage.getItem("alerts") != "[]")
        setInterval(() => {
            let alerts = JSON.parse(localStorage.getItem("alerts"));
            let produtos = JSON.parse(localStorage.getItem("products"));

            alerts.forEach(a => {
                produtos.forEach( p => {
                    if (a.idProduto == p.id && a.valorDesejado >= p.valor) {
                        vetor = alerts.filter(a => a.idProduto != p.id);
                        localStorage.setItem("alerts", JSON.stringify(vetor));

                        if (a.acao == "Alertar")
                            alert("AVISO: O produto " + a.idProduto + " está no valor desejado!");
                        else
                            comprarProduto(p);
                    }
                });
            });
        }, 3000);
}

function comprarProduto(produto) {
    if (localStorage.getItem("shopping")) {
        let shopping = JSON.parse(localStorage.getItem("shopping"));
        shopping.push(produto);
        localStorage.setItem("shopping", JSON.stringify(shopping));
    } else {
        let vetor = [];
        vetor.push(produto);
        localStorage.setItem("shopping", JSON.stringify(vetor));
    }
    
    alert("Produto " + produto.id + " comprado!");  
    window.location.reload(true);
}

// home page
function setHome() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;
    $("h2")[0].innerText = "Olá, " + user.nome;

    alertsController();
}

// my products page
async function setMyProducts() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;
    $("h2")[0].innerText = "Produtos Disponíveis";

    let link = api + "produto/" + user.chave + "/usuario";
    
    const response = await fetch(link)
    .then( async data => {
        let list = await data.json();
        if (list != null && list != "{}"){
            localStorage.setItem("products", JSON.stringify(list));
            setProductsTable();
        }
        else
            alert("VALIDAR: sem produtos cadastrados");

    }).catch( error => {
        console.error("API error: " + error);
    });

    alertsController();
}

function setProductsTable() {
    let list = JSON.parse(localStorage.getItem("products"));
    
    list.forEach(item => {
        let newRow = $("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.id;  
        newRow.insertCell().textContent = item.descricao;
        newRow.insertCell().textContent = "R$" + item.valor;
        newRow.insertCell().innerHTML = "<img src=" + item.urlImagem + "/>";
    });
}

// price alert page
async function setPriceAlert() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;

    $("h2")[0].innerText = "Meus Alertas";

    if (!localStorage.getItem("products")) {
        let link = api + "produto/" + user.chave + "/usuario";

        const response = await fetch(link)
        .then( async data => {
            let list = await data.json();
            if (list != null && list != "{}")
                localStorage.setItem("products", JSON.stringify(list));
            else
                alert("VALIDAR: sem produtos cadastrados");
        }).catch( error => {
            console.error("API error: " + error);
        });
    }

    let products = JSON.parse(localStorage.getItem("products"));
    let select = $("select")[0];
    products.forEach(item => {
        select.add(new Option(item.id + " - " + item.descricao, item.id));
    });

    if(localStorage.getItem("alerts") && localStorage.getItem("alerts") != "[]")
        setMyAlerts();

    alertsController();
}

function setMyAlerts() {
    $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
    $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
    $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Código</th> <th>Valor Desejado</th> <th>Ação</th> <th></th> </tr>");

    let alerts = JSON.parse(localStorage.getItem("alerts"));

    alerts.forEach(item => {
        let newRow = $("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.idProduto;
        newRow.insertCell().textContent = "R$" + item.valorDesejado;
        newRow.insertCell().textContent = item.acao;
        newRow.insertCell().innerHTML = 
        "<button class='btn btn-danger' type='button' id=" + item.idProduto + " onclick='deleteAlert(" + item.idProduto + ")'>Deletar</button>";
    });
}

function addAlert(){
    if(!$("#form2").valid())
        return;

    let idProduct = $("#product").val();
    let price = $("#price").val();
    document.getElementsByName("action").forEach( item => {
        if (item.checked) 
            action = item.value; 
    });

    let retorno = checkCopyAlert(idProduct);
    if (retorno) {
        alert("O item "+ retorno.idProduto+" já possui um alerta!");
        return;
    }

    const newAlert = {
        idProduto: idProduct,
        valorDesejado: price,
        acao: action
    };
    let alerts = [];

    if(!localStorage.getItem("alerts") || localStorage.getItem("alerts") == "[]"){
        $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
        $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
        $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Código</th> <th>Valor Desejado</th> <th>Ação</th> <th></th> </tr>");
    }else 
        alerts = JSON.parse(localStorage.getItem("alerts"));
    
    alerts.push(newAlert);
    localStorage.setItem("alerts", JSON.stringify(alerts));

    let newRow = $("tbody")[0].insertRow();
    newRow.insertCell().textContent = newAlert.idProduto;
    newRow.insertCell().textContent = "R$" + newAlert.valorDesejado;
    newRow.insertCell().textContent = newAlert.acao;
    newRow.insertCell().innerHTML = 
    "<button class='btn btn-danger' type='button' id=" + newAlert.idProduto + " onclick='deleteAlert(" + newAlert.idProduto + ")'>Deletar</button>";

    $("#product").val("");
    $("#price").val("");
    $("#action").val("");
}

function checkCopyAlert(id) {
    if (!localStorage.getItem("alerts") || localStorage.getItem("alers") == "[]")
        return false;
    alerts = JSON.parse(localStorage.getItem("alerts"));
    return alerts.find(a => a.idProduto == id);
}

function deleteAlert(id) {
    let alerts = JSON.parse(localStorage.getItem("alerts"));
    alerts = alerts.filter(a => a.idProduto != id);
    localStorage.setItem("alerts", JSON.stringify(alerts));
    window.location.reload(true);
}

// set my shopping page
function setMyShopping() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;

    $("h2")[0].innerText = "Minhas Compras";

    if(localStorage.getItem("shopping")) {
        $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Código</th> <th>Descrição</th> <th>Valor</th> </tr>");

        let shopping = JSON.parse(localStorage.getItem("shopping"));

        shopping.forEach(item => {
            let newRow = $("tbody")[0].insertRow();
            newRow.insertCell().textContent = item.id;
            newRow.insertCell().textContent = item.descricao;
            newRow.insertCell().textContent = "R$" + item.valor;
        });
    }

    alertsController();
}