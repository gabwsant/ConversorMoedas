//executar ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const btnAlternar = document.getElementById("btnAlternar");
  const btnConverter = document.getElementById("btnConverter");
  const valor = document.getElementById("valor");
  valor.value = "0,00";

  //listeners
  btnAlternar.addEventListener("click", alternarMoedas);
  btnConverter.addEventListener("click", converter);
  valor.addEventListener("input", formatarParaMoeda);
  valor.addEventListener("blur", formatarParaMoeda);
});

//botão de alternar moedas
function alternarMoedas() {
  let moeda1 = document.getElementById("moeda1").value;
  let moeda2 = document.getElementById("moeda2").value;
  document.getElementById("moeda1").value = moeda2;
  document.getElementById("moeda2").value = moeda1;
}

function formatarParaMoeda(e) {
  let valorInput = valor.value;

  valorInput = valorInput.replace(/\D/g, ""); //esse regex remove tudo que não é dígito

  const valorNumerico = parseFloat(valorInput) / 100;

  if (!isNaN(valorNumerico)) {
    //esse método formata o número para o formato brasileiro
    valor.value = valorNumerico.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    valor.value = "";
  }
}

function converter() {
  let moeda1 = document.getElementById("moeda1").value;
  let moeda2 = document.getElementById("moeda2").value;
  let valor = document.getElementById("valor").value;

  if (moeda1 === moeda2) {
    alert("As moedas devem ser diferentes!");
    return;
  }

  // Remove o formato de moeda e converte para número
  const valorNumerico = parseFloat(valor.replace(/\./g, "").replace(",", "."));

  if (isNaN(valorNumerico)) {
    alert("Valor inválido. Por favor, insira um número válido.");
    return;
  }

  // Chamada à API para obter a taxa de câmbio
  fetchTaxaCambio(moeda1, moeda2, valorNumerico);
}

async function fetchTaxaCambio(moeda1, moeda2, valor) {
  const url = `https://api.fastforex.io/fetch-one?api_key=fe7a80e78b-5218041e35-sxi97q/${moeda1}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar a taxa de câmbio.");
    }

    const data = await response.json();
    const taxaCambio = data.rates[moeda2];

    if (!taxaCambio) {
      throw new Error(`Taxa de câmbio não encontrada para ${moeda2}.`);
    }

    const valorConvertido = valor * taxaCambio;
    alert(`Valor convertido: ${valorConvertido.toFixed(2)} ${moeda2}`);
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro ao converter o valor. Tente novamente.");
  }
}

let url =
  "https://api.fastforex.io/fetch-all?api_key=fe7a80e78b-5218041e35-sxi97q" +
  "&from=USD&to=EUR,BRL,JPY,GBP,AUD,CAD,CHF,CNY,RUB,INR";

let options = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};

const response = await fetch(url, options)
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.error("Error:", err));
