var api = "https://api-odinline.odiloncorrea.com/";

// object user: 
// {id: 6, nome: 'Usuario Teste', login: 'teste', email: 'usuarioTeste@gmail.com', chave: '61589-6'}

async function logar() {
    let login = document.getElementById("login").value; 
    let password = document.getElementById("password").value; 
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

function setUser() {
    let user = JSON.parse(localStorage.getItem("userLogado"));
    document.getElementById("userName").innerText = user.nome;
    document.getElementsByTagName("h2")[0].innerText = "Olá, " + user.nome;
}

async function getMyProducts() {
    setUser();
    document.getElementsByTagName("h2")[0].innerText = "Meus Produtos";

    let user = JSON.parse(localStorage.getItem("userLogado"));
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
        let newRow = document.getElementsByTagName("tbody")[0].insertRow();
        newRow.insertCell().textContent = item.descricao;
        newRow.insertCell().textContent = item.valor;
        newRow.insertCell().innerHTML = "<img src=" + item.urlImagem + "/>";
    });
}
