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
        listaDeFornecedores.push(fornecedor);
        localStorage.setItem("fornecedores", JSON.stringify(listaDeFornecedores));
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

function excluirFornecedor(nome){
    if(confirm("Deseja realmente excluir o cliente " + nome + "?")){
        listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => { 
            return fornecedor.nome !== nome;
        });
        localStorage.setItem("fornecedores", JSON.stringify(listaDeFornecedores));
        document.getElementById(nome).remove(); //excluir a linha da tabela
    }
}

mostrarTabelaFornecedores();