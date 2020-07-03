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
        let cambio = "OTHER";
        if (car.opcionais[0] !== "") {
          opcionais = car.opcionais[0].opcional.map((op) => op._).join(" | ");
        }

        if (car.cambio[0]._ === "Manual") {
          cambio = "MANUAL";
        } else if (car.cambio[0]._ === "Automático") {
          cambio = "AUTOMATIC";
        }

        sanitizedCars.push({
          fb_page_id: "110667224041697",
          vehicle_id: `${car.modelo[0]._.trim()}-${car.id[0]}`,
          title: `${car.marca[0]._} ${car.modelo[0]._} ${car.versao[0]._}`,
          description: opcionais,
          url: `https://grupoautonunes.com/veiculo/${car.modelo[0]._.trim()}-${
            car.id[0]
          }`,
          make: car.marca[0]._,
          model: car.modelo[0]._.trim(),
          year: car.anomodelo[0],
          mileage: {
            value: car.km[0],
            unit: "KM",
          },
          address: {
            component: [
              car.loja[0].endereco[0].cidade[0],
              "Pernambuco",
              "Brasil",
            ],
          },
          image: car.fotos[0].foto[0],
          transmission: cambio,
          body_style: "NONE",
          drivetrain: "Other",
          price: `${car.preco[0]} BRL`,
          exterior_color: car.cor[0]._,
          state_of_vehicle: "USED",
        });
      }
    });

    // sanitizedCars.forEach((car) => {
    //   console.log(car.vehicle_id);
    // });

    // console.log(sanitizedCars.length, merged.length);

    var xmlRes = js2xmlparser.parse("listing", sanitizedCars);
    xmlRes = xmlRes.replace(
      "<?xml version='1.0'?>\n<listing>",
      "<?xml version='1.0' encoding='UTF-8'?>\n<listings>\n<title>Grupo Autonunes Feed</title>\n<link rel='self' href='https://grupoautonunes.com' />"
    );

    xmlRes = xmlRes.replace(
      "</listing>\n</listing>",
      "</listing>\n</listings>"
    );
    console.log(xmlRes.length);
    res.type("application/xml");
    res.send(xmlRes);
  },
};
