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
        localStorage.setItem("userLogado", JSON.stringify(result));
        window.location.href = "home.html";

    }).catch( error => {
        console.error("Error" + error);
    });
}

function redirecionar(){
    alert("Redirecionando...")
    window.location.href = "https://www.odiloncorrea.com/odinline/login.php";
}