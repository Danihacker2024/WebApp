
const urlBase = 'http://localhost:4000/produtos';

const formulario = document.getElementById("formCadProdutos");
let listaDeProdutos = [];

//if (localStorage.getItem("produtos")){
    //recuperando do armazenamento local a lista de produtos
  //  listaDeProdutos = JSON.parse(localStorage.getItem("produtos"));
   // mostrarTabelaProdutos();
//}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("Produto").value;
        const preco = document.getElementById("Preco").value;
        const estoque = document.getElementById("Estoque").value;
        const produto = {nome,preco,estoque};
        cadastrarProduto(produto)
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
            linha.id=listaDeProdutos[i].id;
            linha.innerHTML=`
                <td>${listaDeProdutos[i].nome}</td>
                <td>${listaDeProdutos[i].preco}</td>
                <td>${listaDeProdutos[i].estoque}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirProduto('${listaDeProdutos[i].id}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirProduto(id) {
    if (confirm("Deseja realmente excluir o fornecedor " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        }).then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        }).then((dados) => {
            alert("Produto excluído com sucesso!");
            listaDeProdutos = listaDeProdutos.filter((produto) => {
                return produto.id !== id;
            });
            // Atualizar o localStorage após a exclusão
            //localStorage.setItem("produtos", JSON.stringify(listaDeProdutos));
            document.getElementById(id)?.remove(); // Excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}


function obterDadosProdutos(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((produtos)=>{
        listaDeProdutos=produtos;
        //localStorage.setItem("produtos", JSON.stringify(produtos));
        mostrarTabelaProdutos();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar produtos do servidor!");
    });
}

function cadastrarProduto(produto){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(produto)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Produto incluido com sucesso! ID:${dados.id}`);
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Produto:" + erro);
    })
}


obterDadosProdutos();