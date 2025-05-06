var api = "https://api-odinline.odiloncorrea.com/";
// object user: 
// {id: 6, nome: 'Usuario Teste', login: 'teste', email: 'usuarioTeste@gmail.com', chave: '61589-6'}

// index page
async function logar() {
    let login = $("#login").val();
    let password = $("#password").val();
    let link = api + "usuario/" + login + "/" + password + "/autenticar";
    
    console.info(link);

    const response = await fetch(link)
    .then( async data => {
        let result = await data.json();
        if (result != null && result != "{}"){
            localStorage.setItem("userLogado", JSON.stringify(result));
            window.location.href = "home.html";
        }else
            alert("VALIDAR: Usuário NÃO existe");

    }).catch( error => {
        console.error("API error: " + error);
    });
}

// all pages
function logout() {
    if(localStorage.getItem("userLogado")) 
        localStorage.removeItem("userLogado");
}

// home page
function setHome() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;
    $("h2")[0].innerText = "Olá, " + user.nome;
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
}

function setProductsTable() {
    let list = JSON.parse(localStorage.getItem("products"));
    
    list.forEach(item => {
        let newRow = $("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.id;  
        newRow.insertCell().textContent = item.descricao;
        newRow.insertCell().textContent = item.valor;
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
}

function setMyAlerts() {
    $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
    $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
    $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Código</th> <th>Valor Desejado</th> <th>Ação</th> <th>Status</th> </tr>");

    let alerts = JSON.parse(localStorage.getItem("alerts"));

    alerts.forEach(item => {
        let newRow = $("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.idProduto;
        newRow.insertCell().textContent = item.valorDesejado;
        newRow.insertCell().textContent = item.acao;
        newRow.insertCell().innerHTML = 
        "<button class='btn btn-danger' type='button' id=" + item.idProduto + " onclick='deleteAlert(" + item.idProduto + ")'>Deletar</button>";
    });
}

function addAlert(){
    let idProduct = $("#product").val();
    let price = $("#price").val();
    document.getElementsByName("action").forEach( item => {
        if (item.checked) 
            action = item.value; 
    });

    const newAlert = {
        idProduto: idProduct,
        valorDesejado: price,
        acao: action
    };
    let alerts = [];

    if(!localStorage.getItem("alerts") || localStorage.getItem("alerts") == "[]"){
        $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
        $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
        $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Código</th> <th>Valor Desejado</th> <th>Ação</th> <th>Status</th> </tr>");
    }else 
        alerts = JSON.parse(localStorage.getItem("alerts"));
    
    alerts.push(newAlert);
    localStorage.setItem("alerts", JSON.stringify(alerts));

    let newRow = $("tbody")[0].insertRow();
    newRow.insertCell().textContent = newAlert.idProduto;
    newRow.insertCell().textContent = newAlert.valorDesejado;
    newRow.insertCell().textContent = newAlert.acao;
    newRow.insertCell().innerHTML = 
    "<button class='btn btn-danger' type='button' id=" + newAlert.idProduto + " onclick='deleteAlert(" + newAlert.idProduto + ")'>Deletar</button>";
}

function deleteAlert(id) {
    let alerts = JSON.parse(localStorage.getItem("alerts"));
    alerts = alerts.filter(a => a.idProduto != id);
    localStorage.setItem("alerts", JSON.stringify(alerts));
    window.location.reload(true);
}