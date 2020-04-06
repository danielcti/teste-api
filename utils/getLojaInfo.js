const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function getLojaInfo(nome, url) {
  try {
    const response = await axios.get(url);

    const data = response.data;
    const dir = path.join(__dirname, "../files/");
    const fileName = nome;
    fs.writeFile(dir + fileName, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
      return data;
    });
  } catch (err) {
    throw new Error(
      "Um pedido foi menos há menos de 1 minuto, favor tentar novamente em breve."
    );
  }
}

module.exports = getLojaInfo;
