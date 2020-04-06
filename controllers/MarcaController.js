const fs = require("fs");
const path = require("path");
const parseString = require("xml2js").parseString;
const util = require("util");

const fsp = fs.promises;
const readdir = util.promisify(fs.readdir);

module.exports = {
  async index(req, res) {
    let marcas = [];

    const dir = path.join(__dirname, "../files");

    const files = await readdir(dir);

    const promise = await files.map(async (file) => {
      const data = await fsp.readFile(dir + "/" + file);
      const parsedData = data.toString();
      let content;
      await parseString(parsedData, function (err, result) {
        content = result;
      });

      await content.estoque.veiculo.forEach((carro) => {
        const carroMarca = carro.marca[0]._.toLowerCase();
        if (!marcas.includes(carroMarca)) {
          marcas.push(carroMarca);
        }
      });

      return content;
    });

    await Promise.all(promise);

    res.send(marcas);
  },
};
