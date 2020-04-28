const fs = require("fs");
const path = require("path");
const parseString = require("xml2js").parseString;
const util = require("util");
var _ = require("underscore");
const filterPrice = require("../utils/filterPrice");
const category = require("../utils/categoryHash.json");

const fsp = fs.promises;
const readdir = util.promisify(fs.readdir);

module.exports = {
  async index(req, res) {
    const {
      yearRange,
      priceRange,
      colors,
      kmRange,
      cambio,
      marca,
      combustivel,
      opcionais,
      id,
    } = req.body;

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
        const modelo = carro.modelo[0]._.trim();
        if (category[modelo]) {
          carro.categoria = category[modelo];
        }
      });

      if (yearRange) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return (
              carro.anomodelo[0] >= yearRange[0] &&
              carro.anomodelo[0] <= yearRange[1]
            );
          }
        );
        content.estoque.veiculo = filteredContent;
      }
      if (colors) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return colors.includes(carro.cor[0]._.toLowerCase());
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (priceRange) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return filterPrice(carro.preco[0], priceRange[0], priceRange[1]);
          } 
        );
        content.estoque.veiculo = filteredContent;
      }

      if (kmRange) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return (
              Number(carro.km[0]) >= kmRange[0] &&
              Number(carro.km[0]) <= kmRange[1]
            );
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (cambio) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return carro.cambio[0]._ === cambio;
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (marca) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return carro.marca[0]._.toLowerCase() === marca;
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (combustivel) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return carro.combustivel[0]._ === combustivel;
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (id) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return carro.id[0] === id;
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      if (opcionais) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            if (carro.opcionais[0].opcional) {
              const opcs = carro.opcionais[0].opcional.map((op) => op._);
              if (_.difference(opcionais, opcs).length === 0) {
                return true;
              }
            }

            return false;
          }
        );
        content.estoque.veiculo = filteredContent;
      }

      return content;
    });

    const content = await Promise.all(promise);

    res.send(content);
  },
};

// menor preço ser o menor preco possivel pra algo
