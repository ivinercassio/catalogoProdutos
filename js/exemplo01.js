function calcular(){
  var imc = 0;
  var peso = document.getElementById("peso").value;
  var altura = document.getElementById("altura").value;
  peso = parseFloat(peso);
  altura = parseFloat (altura);    
  imc = peso / (altura * altura);
  document.getElementById("imc").value = imc;
}






