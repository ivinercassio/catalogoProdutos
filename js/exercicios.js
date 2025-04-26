function calcular(){
    // exercicio1 
    let x1 = document.getElementById("x1").value;
    let x2 = document.getElementById("x2").value;
    let y1 = document.getElementById("y1").value;
    let y2 = document.getElementById("y2").value;

    let distance = Math.sqrt( Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

    document.getElementById("resultado").setAttribute("value", distance);
}

function calcularAplicacao(){
    // exercicio4
    let valor_aplicacao = document.getElementById("valor").value;
    let taxa = document.getElementById("taxa").value;
    let meses = document.getElementById("meses").value;

    let tbody = document.querySelector("tbody");
    
    var total = 0;
    let valor = valor_aplicacao;

    for (i = 1; i <= meses; i++) {
        rendimento = valor*taxa/100;
        total = valor + rendimento;
        tbody.innerHTML += "<tr> <td>" + i + "</td> <td>" + valor + "</td> <td>" + rendimento + "</td> <td>" + total + "</td> </tr>";
        valor = total;
    }

    document.getElementById("lucro").setAttribute("value", (total - valor));    
}