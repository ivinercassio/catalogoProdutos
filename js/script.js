var api = "https://api-odinline.odiloncorrea.com/";

// object user: 
// {id: 6, nome: 'Usuario Teste', login: 'teste', email: 'usuarioTeste@gmail.com', chave: '61589-6'}

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

function logout() {
    if(localStorage.getItem("userLogado"))
        localStorage.removeItem("userLogado");
}

function setHome() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;
    $("h2")[0].innerText = "Olá, " + user.nome;
}

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
        newRow.insertCell().textContent = item.descricao;
        newRow.insertCell().textContent = item.valor;
        newRow.insertCell().innerHTML = "<img src=" + item.urlImagem + "/>";
    });
}

function setPriceAlert() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;

    $("h2")[0].innerText = "Meus Alertas";

    let products = JSON.parse(localStorage.getItem("products"));
    let select = $("select")[0];
    products.forEach(item => {
        select.add(new Option(item.descricao, item.id));
    });

    if(localStorage.getItem("alerts"))
        setMyAlerts();
}

function setMyAlerts() {
    $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
    $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
    $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Descrição</th> <th>Valor Desejado</th> <th>Ação</th> <th>Status</th> </tr>");

    let alerts = JSON.parse(localStorage.getItem("alerts"));

    alerts.forEach(item => {
        let newRow = $("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.descricao;
        newRow.insertCell().textContent = item.valorDesejado;
        newRow.insertCell().textContent = item.acao;
        newRow.insertCell().innerHTML = "<button class='btn btn-warning' type='button' onclick='deleteAlert('" + item.idProduto + "')'></button>";
    });
}

function addAlert(){
    let idProduct = $("#product").val();
    let price = $("#price").val();
    let descricao = JSON.parse(localStorage.getItem("products")).filter(p => p.id = idProduct)[0].descricao;
    document.getElementsByName("action").forEach( item => {
        if (item.checked) 
            action = item.value; 
    });

    const newAlert = {
        idProduto: idProduct,
        descricao: descricao,
        valorDesejado: price,
        acao: action
    };
    
    if(!localStorage.getItem("alerts")){
        $("form")[0].insertAdjacentHTML("afterend", "<table class='table container mt-2'> </table>");
        $("table")[0].insertAdjacentHTML("afterbegin", "<thead> </thead> <tbody> </tbody>");
        $("thead")[0].insertAdjacentHTML("afterbegin", "<tr> <th>Descrição</th> <th>Valor Desejado</th> <th>Ação</th> <th>Status</th> </tr>");
    }

    localStorage.setItem("alerts", JSON.stringify(newAlert));

    let newRow = $("tbody")[0].insertRow();
    newRow.insertCell().textContent = newAlert.descricao;
    newRow.insertCell().textContent = newAlert.valorDesejado;
    newRow.insertCell().textContent = newAlert.acao;
    newRow.insertCell().innerHTML = "<button class='btn btn-warning' type='button' onclick='deleteAlert('" + newAlert.idProduto + "')'></button>";
}