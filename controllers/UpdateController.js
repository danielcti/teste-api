const getLojaInfo = require("../utils/getLojaInfo");

const lojas = [
  {
    nome: "Auto_Oriente_Caruaru",
    url: "http://xml.dsautoestoque.com/?l=14989426000396&v=2",
  },
  {
    nome: "Auto_Oriente_Recife",
    url: "http://xml.dsautoestoque.com/?l=14989426000124&v=2",
  },
  {
    nome: "Autonunes_Boa_Viagem",
    url: "http://xml.dsautoestoque.com/?l=40889222000393&v=2",
  },
  {
    nome: "Autonunes_Cabo",
    url: "http://xml.dsautoestoque.com/?l=40889222000555&v=2",
  },
  {
    nome: "Caxanga",
    url: "http://xml.dsautoestoque.com/?l=09924937000128&v=2",
  },
];

module.exports = {
  async store(req, res) {
    try {
      await lojas.forEach(async (loja) => {
        await getLojaInfo(loja.nome, loja.url);
      });
    } catch (err) {
      throw new Error(err);
    }

    return res.send("Arquivos atualizados");
  },
};
