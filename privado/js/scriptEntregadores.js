const urlBase = 'http://localhost:4000/entregadores';

const formulario = document.getElementById("formCadentregadores");
let listaDeClientes = [];

if (localStorage.getItem("entregadores")){
    //recuperando do armazenamento local a lista de clientes
    listaDeClientes = JSON.parse(localStorage.getItem("entregadores"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const carteira = document.getElementById("carteira").value;
        const placa = document.getElementById("placa").value;
        const veiculo = document.getElementById("veiculo").value;

        const entregadores = {cpf,nome,telefone,cidade,uf,cep, carteira, placa, veiculo};
        cadastrarCliente(cliente);
        formulario.reset();
        mostrarTabelaClientes();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaClientes(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeClientes.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
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
                <th>CEP</th>
                <th>Placa</th>
                <th>Carteira</th>
                <th>Veiculo</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeentregadores.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeentregadores[i].cpf;
            linha.innerHTML=`
                <td>${listaDeentregadores[i].cpf}</td>
                <td>${listaDeentregadores[i].nome}</td>
                <td>${listaDeentregadores[i].telefone}</td>
                <td>${listaDeentregadores[i].cidade}</td>
                <td>${listaDeentregadores[i].uf}</td>
                <td>${listaDeentregadores[i].cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirCliente('${listaDeentregadores[i].cpf}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirentreadores(id){
    if(confirm("Deseja realmente excluir o entregador " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Entregador excluído com sucesso!");
            listaDeentregadores = listaDeentregadores.filter((entregadores) => { 
                return entregadores.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o entregador: " + erro);
        });
    }
}

function obterDadosentregadores(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((clientes)=>{
        listaDeentregadores=clientes;
        mostrarTabelaentregador();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar entregador do servidor!");
    });
}

function cadastrarCliente(cliente){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(cliente)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Cliente incluido com sucesso! ID:${dados.id}`);
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o cliente:" + erro);
    })
}


obterDadosClientes();