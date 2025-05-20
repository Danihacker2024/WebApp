const formulario = document.getElementById("formCadProdutos");
let listaDeProdutos = [];

if (localStorage.getItem("produtos")){
    //recuperando do armazenamento local a lista de produtos
    listaDeProdutos = JSON.parse(localStorage.getItem("produtos"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("Produto").value;
        const preco = document.getElementById("Preco").value;
        const estoque = document.getElementById("Estoque").value;
        const produto = {nome,preco,estoque};
        listaDeProdutos.push(produto);
        localStorage.setItem("produtos", JSON.stringify(listaDeProdutos));
        formulario.reset();
        mostrarTabelaProdutos();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaProdutos(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeProdutos.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há produtos cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Estoque</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeProdutos.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeProdutos[i].nome;
            linha.innerHTML=`
                <td>${listaDeProdutos[i].nome}</td>
                <td>${listaDeProdutos[i].preco}</td>
                <td>${listaDeProdutos[i].estoque}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirProduto('${listaDeProdutos[i].nome}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirProduto(nome){
    if(confirm("Deseja realmente excluir o produto " + nome + "?")){
        listaDeProdutos = listaDeProdutos.filter((produto) => { 
            return produto.nome !== nome;
        });
        localStorage.setItem("produtos", JSON.stringify(listaDeProdutos));
        document.getElementById(nome).remove(); //excluir a linha da tabela
    }
}

mostrarTabelaProdutos();