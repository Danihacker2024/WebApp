
const urlBase = 'http://localhost:4000/usuarios';

const formulario = document.getElementById("formCadUsuarios");
let lista = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const login = document.getElementById("login").value;
        const senha = document.getElementById("senha").value;
        const usuario = {login,senha};
        cadastrar(usuario);
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
                <th>Login</th>
                <th>Senha</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < lista.length; i++){
            const linha = document.createElement('tr');
            linha.id=lista[i].id;
            linha.innerHTML=`
                <td>${lista[i].login}</td>
                <td>${lista[i].senha}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluir('${lista[i].id}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluir(id){
    if(confirm("Deseja realmente excluir o usuario " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Usuario excluída com sucesso!");
            lista = lista.filter((usuario) => { 
                return usuario.id !== id;
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

function cadastrar(usuario){
    fetch(urlBase,{
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body":JSON.stringify(usuario)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados)=>{
        alert(`Usuario incluida com sucesso! ID:${dados.id}`);
        obterDados();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o usuario:" + erro);
    })
}


obterDados();