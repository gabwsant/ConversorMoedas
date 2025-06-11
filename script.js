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
  let valorInput = e.target.value;

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
  let taxaCambio = fetchTaxaCambio(moeda1, moeda2);
  taxaCambio.then((taxa) => {
    if (taxa) {
      const valorConvertido = valorNumerico * taxa;
      const resultado = document.getElementById("resultado");
      resultado.innerHTML = `Valor convertido: ${valorConvertido.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: moeda2,
        }
      )}<br>Taxa de câmbio: ${taxa}`;
    }
  });
}

async function fetchTaxaCambio(moeda1, moeda2) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_qldV2B1dsfFjvcMXjGttVTIU6O7cMFVB4ArNY13x&currencies=${moeda2}&base_currency=${moeda1}`;

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    alert("Erro ao buscar a taxa de câmbio. Tente novamente mais tarde.");
    return;
  }
  const data = await response.json();
  const taxaCambio = data.data[moeda2];

  if (!taxaCambio) {
    alert("Taxa de câmbio não encontrada. Verifique as moedas selecionadas.");
    return;
  }

  return taxaCambio;
}
