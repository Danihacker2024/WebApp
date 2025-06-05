
const urlBase = 'http://localhost:4000/categorias';

const formulario = document.getElementById("formCadCategorias");
let lista = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const tipo = document.getElementById("tipo").value;
        const categoria = {nome,descricao,tipo};
        cadastrar(categoria);
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
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Descricao</th>
                <th>Tipo</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < lista.length; i++){
            const linha = document.createElement('tr');
            linha.id=lista[i].id;
            linha.innerHTML=`
                <td>${lista[i].nome}</td>
                <td>${lista[i].descricao}</td>
                <td>${lista[i].tipo}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluir('${lista[i].id}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluir(id){
    if(confirm("Deseja realmente excluir o cliente " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Categoria excluída com sucesso!");
            lista = lista.filter((categoria) => { 
                return categoria.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir: " + erro);
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
    .then((dados)=>{
        lista=dados;
        mostrarTabela();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar os dados do servidor!");
    });
}

function cadastrar(categoria){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(categoria)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Categoria incluida com sucesso! ID:${dados.id}`);
        obterDados();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar a categoria:" + erro);
    })
}


obterDados();