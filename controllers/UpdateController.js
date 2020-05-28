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
  {
    nome: "Autonunes_Caruaru",
    url: "http://xml.dsautoestoque.com/?l=40889222000806&v=2",
  },
  {
    nome: "Autonunes_Gravata",
    url: "http://xml.dsautoestoque.com/?l=40889222000717&v=2",
  },
  {
    nome: "Autonunes_Olinda",
    url: "http://xml.dsautoestoque.com/?l=40889222000474&v=2",
  },
  {
    nome: "Autonunes_Prazeres",
    url: "http://xml.dsautoestoque.com/?l=40889222000121&v=2",
  },
];

module.exports = {
  async store(req, res) {
    try {
      await lojas.forEach(async (loja) => {
        await getLojaInfo(loja.nome, loja.url);
        console.log("Arquivos atualizados com sucesso");
        return res("Arquivos atualizados com sucesso");
      });
    } catch (err) {
      throw new Error(err);
    }

    return;
  },
};
