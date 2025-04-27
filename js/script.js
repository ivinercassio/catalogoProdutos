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
        // save user on LocalStorage
        console.log(result);
        if (result != null && result != "{}"){
            localStorage.setItem("userLogado", JSON.stringify(result));
            window.location.href = "home.html";
        }else
            alert("VALIDAR: Usuário NÃO existe")

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
