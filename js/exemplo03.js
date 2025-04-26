function somar(){
	var contador = 0;
	var soma = 0;
	var inicio = parseFloat(document.getElementById("inicio").value);
	var termino = parseFloat(document.getElementById("termino").value);	
	contador = inicio;
	while(contador <= termino){
		soma = soma + contador;
		contador = contador + 1;
	}
	document.getElementById("soma").value = soma;
}

