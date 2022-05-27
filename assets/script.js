//Requisitions dealing with CRUD operations
class Requisitions {
  async fetchAllPaletasAndUpdateArray() {
    const response = await fetch(`${baseURL}/find-paletas`);

    const paletas = await response.json();

    if (paletas.message != undefined) {
      //tratar erro de não achar nenhuma paleta no db(mensagem vem da api)
      showAlertSpan(paletas.message, "Danger");
    }

    arrayPaletas = paletas;

    return paletas;
  }

  async findPaletaById(id) {
    const response = await fetch(`${baseURL}/find-paleta/${id}`);
    const paleta = await response.json();
    return paleta;
  }

  async createOrUpdatePaleta() {
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

    const modoEdicao = id != "";

    const endpoint =
      baseURL + (modoEdicao ? `/update-paleta/${id}` : `/create-paleta`);

    const response = await fetch(endpoint, {
      method: modoEdicao ? "put" : "post",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(paleta),
    });

    const novaPaleta = await response.json();

    if (novaPaleta.message != undefined) {
      //tratar erro de mandar campos vazios tanto em cadastro quanto em atualização(mensagem vem da api)
      showAlertSpan(novaPaleta.message, "Danger");
    } else {
      let message = "Paleta cadastrada com sucesso!";
      // mostrar mensagem de cadastro/atualização com sucesso(mensagem nao vem da api)
      if (modoEdicao) {
        message = "Paleta atualizada com sucesso";
      }
      showAlertSpan(message, "Success");
    }

    const chosenPaletaDiv = document.getElementById("chosenPaleta");
    chosenPaletaDiv.innerHTML = "";

    printAllPaletas();
    fecharModal();
  }

  async deletePaleta(id) {
    // console.log(`Vou tentar deletar a de id ${id}`);
    const response = await fetch(`${baseURL}/delete-paleta/${id}`, {
      method: "delete",
      mode: "cors",
    });
    const result = await response.json();

    if (result.message != undefined) {
      //tratar erro de n encontrar a paleta para deletar (mensagem vem da api)
      showAlertSpan(result.message, "Danger");
    } else {
      //mostrar mensagem de deleção com sucesso (mensagem nao vem da api)
      showAlertSpan("Paleta deletada com sucesso!", "Success");
    }

    const chosenPaletaDiv = document.getElementById("chosenPaleta");
    chosenPaletaDiv.innerHTML = "";
    closeDeleteModal();
    printAllPaletas();
  }
}

//Auxiliary variables
// const baseURL = "https://el-geladon-api-v1.onrender.com/paletas";
const baseURL = "http://localhost:3001/paletas";
let arrayPaletas = [];
const requisitions = new Requisitions();

//HTML manipulation functions
const printAllPaletas = async () => {
  await requisitions.fetchAllPaletasAndUpdateArray();

  document.getElementById("avaliablePaletas").style.display = "flex";
  document.getElementById("searchResult").style.display = "none";
  document.querySelector("#paletaList").innerHTML = "";

  arrayPaletas.forEach(function (paleta) {
    document.querySelector("#paletaList").insertAdjacentHTML(
      "beforeend",
      `
        <div class="PaletaListItem">
          <div>
            <div class="PaletaListItemSabor">${paleta.sabor}</div>
            <div class="PaletaListItemPreco">RS ${paleta.preco.toFixed(2)}</div>
            <div class="PaletaListItemDescricao">${paleta.descricao}</div>
            <div class="PaletaListItemActions Actions">
              <button class="ActionsEdit Btn" onclick="openModal('${
                paleta._id
              }')">Editar</button>
              <button class="ActionsDelete Btn" onclick="openDeleteModal('${
                paleta._id
              }')">Apagar</button>
            </div>
          </div>
          <img class="PaletaListItemFoto" src=${paleta.foto} alt="Paleta de ${
        paleta.sabor
      }" />
        </div>
    `
    );
  });
};

printAllPaletas();

const findPaletaByName = async () => {
  const paletaName = document.getElementById("namePaleta").value;

  if (!paletaName) {
    //tratar usuario n digitar o nome(erro apenas no front)
    showAlertSpan("Digite um sabor de paleta!", "Danger");
    return;
  }

  const selectedPaleta = arrayPaletas.find((elem) => elem.sabor === paletaName);

  if (!selectedPaleta) {
    // tratar erro de não encontrar o nome(erro apenas no front);
    showAlertSpan("O sabor de paleta não foi encontrado!", "Danger");
    return;
  }

  const queriedPaleta = await requisitions.findPaletaById(selectedPaleta._id);

  if (queriedPaleta.message != undefined) {
    //tratar erro de não encontrar a paleta no db(mensagem vem da api);
    showAlertSpan(queriedPaleta.message, "Danger");
    return;
  } else {
    printPaletaSearch(queriedPaleta);
  }
};

const printPaletaSearch = (paleta) => {
  const chosenPaletaDiv = document.getElementById("chosenPaleta");

  document.querySelector(".PaletaList").innerHTML = "";
  document.getElementById("avaliablePaletas").style.display = "none";
  document.getElementById("searchResult").style.display = "flex";

  chosenPaletaDiv.innerHTML = `
  <div class="PaletaCardItem">
      <div>
          <div class="PaletaCardItemSabor"> ${paleta.sabor}</div>
          <div class="PaletaCardItemPreco">R$ ${paleta.preco.toFixed(2)}</div>
          <div class="PaletaCardItemDescricao">${paleta.descricao}</div>
          <div class="PaletaListItemActions Actions">
            <button class="ActionsEdit Btn" onclick="openModal('${
              paleta._id
            }')">Editar</button>
            <button class="ActionsDelete Btn" onclick="openDeleteModal('${
              paleta._id
            }')">Apagar</button>
          </div>
      </div>
          <img class="PaletaCardItemFoto" src=${
            paleta.foto
          } alt=${`Paleta de ${paleta.sabor}`}/>
  </div>`;

  chosenPaletaDiv.insertAdjacentHTML(
    "beforeend",
    `
      <button class="DefaultButton" type="button" onclick="cleanSearchResult()">
        Listar todas as paletas
      </button>
  `
  );

  document.getElementById("namePaleta").value = "";
};

const cleanSearchResult = () => {
  document.getElementById("chosenPaleta").innerHTML = "";
  printAllPaletas();
};

const openModal = async (id = "") => {
  // console.log(`Abri o modal editar com o id ${id}`);
  if (id != "") {
    //o usuario vai atualizar a paleta
    document.querySelector("#titleHeaderModal").innerText =
      "Atualizar uma Paleta";
    document.querySelector("#submitModalButton").innerText = "Atualizar";

    const paleta = await requisitions.findPaletaById(id);

    if (paleta.message != undefined) {
      return showAlertSpan(paleta.message, "Danger");
    }

    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
    document.querySelector("#id").value = paleta._id;
  } else {
    document.querySelector("#titleHeaderModal").innerText =
      "Cadastrar uma Paleta";
    document.querySelector("#submitModalButton").innerText = "Cadastrar";
  }
  document.querySelector(".ModalOverlay").style.display = "flex";
};

const fecharModal = () => {
  document.querySelector(".ModalOverlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = undefined;
  document.querySelector("#foto").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#id").value = "";
};

const openDeleteModal = (id) => {
  // console.log(`Abri o modal delete com o id ${id}`);
  document.querySelector("#overlayDelete").style.display = "flex";

  document.querySelector(".BtnsDelete").insertAdjacentHTML(
    "beforeend",
    `

  <button class="BtnDeleteNo BtnDelete" onclick="closeDeleteModal()">Não</button>
  <button class="BtnDeleteYes BtnDelete" onclick="requisitions.deletePaleta('${id}')">Sim</button>

  `
  );
};

const closeDeleteModal = () => {
  document.querySelector("#overlayDelete").style.display = "none";
  document.querySelector(".BtnsDelete").innerHTML = "";
};

const showAlertSpan = (message, type) => {
  let span = document.getElementById("msgAlert");
  span.innerText = message;
  span.classList.add(type);
  span.style.display = "flex";
  setTimeout(function () {
    span.style.display = "none";
    span.innerText = "";
    //zerar a classe tbm
    span.className = "";
  }, 5000);
};
