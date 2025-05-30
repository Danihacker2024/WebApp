const urlBase = 'http://localhost:4000/entregadores';

const formulario = document.getElementById("formCadentregadores");
let lista = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const carteira = document.getElementById("carteira").value;
        const placa = document.getElementById("placa").value;
        const veiculo = document.getElementById("veiculo").value;

        const entregador = {cpf,nome,telefone,cidade,uf,carteira, placa, veiculo};
        cadastrar(entregador);
        formulario.reset();
        mostrarTabela();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabela(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (lista.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há entregadores cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>Placa</th>
                <th>Carteira</th>
                <th>Veiculo</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < lista.length; i++){
            const linha = document.createElement('tr');
            linha.id=lista[i].id;
            linha.innerHTML=`
                <td>${lista[i].cpf}</td>
                <td>${lista[i].nome}</td>
                <td>${lista[i].telefone}</td>
                <td>${lista[i].cidade}</td>
                <td>${lista[i].uf}</td>
                <td>${lista[i].carteira}</td>
                <td>${lista[i].placa}</td>
                <td>${lista[i].veiculo}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluir('${lista[i].id}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluir(id){
    if(confirm("Deseja realmente excluir o entregador " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Entregador excluído com sucesso!");
            lista = lista.filter((entregadores) => { 
                return entregadores.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o entregador: " + erro);
        });
    }
}

function obterDados(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((entregadores)=>{
        lista=entregadores;
        mostrarTabela();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar entregador do servidor!");
    });
}

function cadastrar(entregador){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(entregador)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Entregador incluido com sucesso! ID:${dados.id}`);
        obterDados(); 
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o entregador:" + erro);
    })
}


obterDados();