const urlBase = 'http://localhost:4000/clientes';

const formulario = document.getElementById("formCadFornecedor");
let listaDeFornecedores = [];

if (localStorage.getItem("fornecedores")){
    //recuperando do armazenamento local a lista de"fornecedores
    listaDeFornecedores = JSON.parse(localStorage.getItem("fornecedores"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("Nome").value;
        const telefone = document.getElementById("Telefone").value;
        const endereco = document.getElementById("Endereco").value;
        const email = document.getElementById("Email").value;
        const fornecedor = {nome,telefone,endereco,email};
        cadastrarFornecedor(fornecedor);
        formulario.reset();
        mostrarTabelaFornecedores();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaFornecedores(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeFornecedores.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há fornecedores cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Email<th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeFornecedores.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeFornecedores[i].nome;
            linha.innerHTML=`
                <td>${listaDeFornecedores[i].nome}</td>
                <td>${listaDeFornecedores[i].telefone}</td>
                <td>${listaDeFornecedores[i].endereco}</td>
                <td>${listaDeFornecedores[i].email}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirFornecedor('${listaDeFornecedores[i].nome}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}


function excluirFornecedor(id){
    if(confirm("Deseja realmente excluir o fornecedor " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Fornecedor excluído com sucesso!");
            listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => { 
                return fornecedor.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o fornecedor: " + erro);
        });
    }
}

function obterDadosFornecedores(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((fornecedores)=>{
        listaDeFornecedores=fornecedores;
        mostrarTabelaFornecedores();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar fornecedores do servidor!");
    });
}

function cadastrarFornecedor(fornecedor){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(fornecedor)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Fornecedor incluido com sucesso! ID:${dados.id}`);
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Fornecedor:" + erro);
    })
}


obterDadosFornecedores();