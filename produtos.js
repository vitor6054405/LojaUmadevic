const produtos = {
  "camiseta-jesus-azul": {
    nome: "Camiseta Oversized Jesus Copy (Azul)",
    codigo: "AW4FR4N8A",
    parcelado: "R$ 74,00",
    antigo: "R$ 168,00",
    final: "R$ 148,00",
    pix: "R$ 140,60",
    descricao: "A camiseta oversized possui estampa frontal e traseira, tecido premium e modelagem moderna.",
    frente: "imagem-frente.png",
    costas: "imagem-costas.png"
  }
};

const id = new URLSearchParams(window.location.search).get("id");

if(produtos[id]){
  const p = produtos[id];
  document.getElementById("nome-produto").innerText = p.nome;
  document.getElementById("codigo-produto").innerText = p.codigo;
  document.getElementById("parcelado").innerText = p.parcelado;
  document.getElementById("preco-antigo").innerText = p.antigo;
  document.getElementById("preco-final").innerText = p.final;
  document.getElementById("pix").innerText = p.pix;
  document.getElementById("descricao").innerText = p.descricao;
  document.getElementById("img-frente").src = p.frente;
  document.getElementById("img-costas").src = p.costas;
}