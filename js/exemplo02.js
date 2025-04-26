function calcular(){
	var numero = document.getElementById("numero").value;
	numero = parseInt(numero);	
	var temp = numero % 2;
	var mensagem = "";
	if(temp == 0){
		mensagem = "O número " + numero + " é par";
	}else{
		mensagem = "O número " + numero + " é ímpar";
	}
	document.getElementById("resultado").value = mensagem;	
}

