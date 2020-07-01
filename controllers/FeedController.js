const fs = require("fs");
const path = require("path");
const parseString = require("xml2js").parseString;
const util = require("util");
var _ = require("underscore");
var js2xmlparser = require("js2xmlparser");
const xml = require("xml");

const fsp = fs.promises;
const readdir = util.promisify(fs.readdir);

let sanitizedCars = [];

String.prototype.replaceBetween = function (start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};

module.exports = {
  async index(req, res) {
    const dir = path.join(__dirname, "../files");
    const files = await readdir(dir);

    const promise = await files.map(async (file) => {
      const data = await fsp.readFile(dir + "/" + file);
      const parsedData = data.toString();
      let content;
      await parseString(parsedData, function (err, result) {
        content = result;
      });

      if (content.estoque.veiculo) {
        await content.estoque.veiculo.forEach((carro) => {
          if (carro) {
            carro.preco[0] = carro.preco[0].slice(3, -3).replace(".", "");
          }
        });
      }

      return content;
    });

    const content = await Promise.all(promise);
    const carros = content
      .map((sede) => Object.entries(sede["estoque"]))
      .map((loja) => loja[0][1]);

    const merged = [].concat.apply([], carros);

    merged.forEach((car) => {
      if (car.id) {
        let opcionais = "Sem opcionais";
        if (car.opcionais[0] !== "") {
          opcionais = car.opcionais[0].opcional.map((op) => op._).join(" | ");
        }
        sanitizedCars.push({
          fb_page_id: "113324413735738",
          vehicle_id: car.id[0],
          title: `${car.marca[0]._} ${car.modelo[0]._} ${car.versao[0]._}`,
          description: opcionais,
          url: `http://grupoautonunes.com/veiculo/${car.modelo[0]._.trim()}-${
            car.id[0]
          }`,
          make: car.marca[0]._,
          model: car.modelo[0]._.trim(),
          year: car.anomodelo[0],
          mileage: {
            value: car.km[0],
            unit: "kms",
          },
          image: car.fotos[0].foto[0],
          transmission: car.cambio[0]._,
          body_style: car.versao[0]._,
          drivetrain: "não informado",
          price: `${car.preco[0]} BRL`,
          exterior_color: car.cor[0]._,
          state_of_vehicle: "Usado",
        });
      }
    });

    var xmlRes = js2xmlparser.parse("veiculo", sanitizedCars);

    res.type("application/xml");
    res.send(xmlRes);
  },
};
