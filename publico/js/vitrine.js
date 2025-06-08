function carregarProdutos(){
    fetch('https://fakestoreapi.com/products',{
        method:"GET"
    }).then((resposta) =>{
        if (resposta.ok){
            return resposta.json();
        }
    }).then((listaDeProdutos) => {
        const divVitrine = document.getElementById("vitrine");
        for (const produto of listaDeProdutos){
            let col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6 mb-4'; 
            col.innerHTML=`
                <div class="card h-100">
                    <img src="${produto.image}" class="card-img-top" style="height: 250px; object-fit: contain;" alt="${produto.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${produto.title}</h5>
                        <p class="card-text">$${produto.price}</p>
                        <a href="#" class="btn btn-primary mt-auto">Comprar</a>
                    </div>
                </div>
            `;
            divVitrine.appendChild(col);
        }
    }).catch((erro)=>{
        alert("Não foi possível carregar os produtos para a vitrine:" + erro);
    });
}

carregarProdutos();
