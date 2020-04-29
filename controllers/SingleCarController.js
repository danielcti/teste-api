const fs = require("fs");
const path = require("path");
const parseString = require("xml2js").parseString;
const util = require("util");
var _ = require("underscore");

const fsp = fs.promises;
const readdir = util.promisify(fs.readdir);

module.exports = {
  async index(req, res) {
    const { id } = req.params;

    const dir = path.join(__dirname, "../files");

    const files = await readdir(dir);

    const promise = await files.map(async (file) => {
      const data = await fsp.readFile(dir + "/" + file);
      const parsedData = data.toString();
      let content;

      await parseString(parsedData, function (err, result) {
        content = result;
      });

      if (id) {
        const filteredContent = await content.estoque.veiculo.filter(
          (carro) => {
            return carro.id[0] === id;
          }
        );
        content = filteredContent;
      }

      return content;
    });

    const content = await Promise.all(promise);

    var filtered = content.filter(function (el) {
      return el.length != 0;
    });

    res.send(filtered);
  },
};
