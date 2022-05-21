const baseURL = "http://localhost:3001/paletas";

async function findAllPaletas() {
  const response = await fetch(`${baseURL}/find-paletas`);

  const paletas = await response.json();

  paletas.forEach(function (paleta) {
    document.querySelector("#paletaList").insertAdjacentHTML(
      "beforeend",
      `
        <div class="PaletaListaItem">
          <div>
            <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
            <div class="PaletaListaItem__preco">RS ${paleta.preco}</div>
            <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
            <div class="PaletaListaItem__acoes Acoes">
              <button class="Acoes__editar btn" onclick="abrirModal(${paleta.id})">Editar</button>
              <button class="Acoes__apagar btn" onclick="abrirModalDelete(${paleta.id})">Apagar</button>
            </div>
          </div>
          <img class="PaletaListaItem__foto" src=${paleta.foto} alt="Paleta de ${paleta.sabor}" />
        </div>
    `
    );
  });
}

findAllPaletas();

const findByIdPaletas = async () => {
  const id = document.getElementById("idPaleta").value;

  const response = await fetch(`${baseURL}/find-paleta/${id}`);

  const paleta = await response.json();

  const paletaEscolhidaDiv = document.getElementById("paletaEscolhida");

  paletaEscolhidaDiv.innerHTML = `<div class="PaletaCardItem">
        <div>
            <div class="PaletaCardItem__sabor"> ${paleta.sabor}</div>
            <div class="PaletaCardItem__preco">R$ ${paleta.preco}</div>
            <div class="PaletaCardItem__descricao">${paleta.descricao}</div>
        </div>
            <img class="PaletaCardItem__foto" src=${
              paleta.foto
            } alt=${`Paleta de ${paleta.sabor}`}/>
    </div>`;
};

async function abrirModal(id = 0) {
  if (id != 0) {
    //o usuario vai atualizar a paleta
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Paleta";
    document.querySelector("#submit-modal-button").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/find-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
    document.querySelector("#id").value = paleta.id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Paleta";
    document.querySelector("#submit-modal-button").innerText = "Cadastrar";
  }
  document.querySelector(".modal-overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = undefined;
  document.querySelector("#foto").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#id").value = 0;
}

async function createPaleta() {
  const id = document.querySelector("#id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const foto = document.querySelector("#foto").value;
  const descricao = document.querySelector("#descricao").value;

  const paleta = {
    id,
    sabor,
    descricao,
    foto,
    preco,
  };

  const modoEdicao = id != 0;

  const endpoint = baseURL + (modoEdicao ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modoEdicao ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  document.querySelector("#paletaList").innerHTML = "";
  findAllPaletas();
  // recarregar a pagina(n vale a pena)
  // window.location.reload();
  fecharModal();
}

function abrirModalDelete(id) {
  console.log(`Abri o modal delete com o id ${id}`);
  document.querySelector("#overlay-delete").style.display = "flex";

  document.querySelector(".btns_delete").insertAdjacentHTML(
    "beforeend",
    `

  <button class="btn-delete_no btn-delete" onclick="fecharModalDelete()">Não</button>
  <button class="btn-delete_yes btn-delete" onclick="deletePaleta(${id})">Sim</button>

  `
  );
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
  document.querySelector(".btns_delete").innerHTML = "";
}

async function deletePaleta(id) {
  console.log(`Vou deletar a de id ${id}`);
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "delete",
    mode: "cors",
  });
  // const result = await response.json();
  // console.log(result);
  fecharModalDelete();
  document.getElementById("paletaList").innerHTML = "";
  findAllPaletas();
}
