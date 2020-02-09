const axios = require("axios");
const fs = require("fs");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const parseString = require('xml2js').parseString;
const util = require('util');

const fsp = fs.promises;
const app = express();
const readdir = util.promisify(fs.readdir);

const lojas = [
  {
    nome: "Auto Oriente Caruaru",
    url: "http://xml.dsautoestoque.com/?l=14989426000396&v=2"
  },
  {
    nome: "Auto Oriente Recife",
    url: "http://xml.dsautoestoque.com/?l=14989426000124&v=2"
  },
  {
    nome: "Autonunes Boa Viagem",
    url: "http://xml.dsautoestoque.com/?l=40889222000393&v=2"
  },
  {
    nome: "Autonunes Cabo",
    url: "http://xml.dsautoestoque.com/?l=40889222000555&v=2"
  },
  // {
  //   nome: "Caxanga",
  //   url: "http://xml.dsautoestoque.com/?l=09924937000128&v=2"
  // }
];

async function getLojaInfo(nome, url) {
  const response = await axios.get(url);

  const data = response.data;
  const today = new Date();
  const fileName = nome + today;
  fs.writeFile(__dirname + "/files/" + fileName, data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
    // console.log(data);
    return data;
  });
}

app.get("/", async function(req, res) {
  const files = await readdir(__dirname + '/files');

  const promise = await files.map(async file => {
      const data = await fsp.readFile(__dirname + '/files/' + file);
      const parsedData = data.toString();
      let content;
      await parseString(parsedData, function (err, result) {
        console.log(result);
        content = result;
      });
      
      return content;
  })

  const content = await Promise.all(promise);

  res.send(content);
});

app.get("/updateFiles", async function(req, res) {
  await lojas.forEach(async loja => {
    await getLojaInfo(loja.nome, loja.url);
  });
  return res.send({hello: "world"})
});

app.use(cors())

app.use(bodyParser.json());

app.listen(process.env.PORT || 3333);


// Auto Oriente (Caruaru): http://xml.dsautoestoque.com/?l=14989426000396&v=2
// Auto Oriente (Recife): http://xml.dsautoestoque.com/?l=14989426000124&v=2
// Autonunes Boa Viagem: http://xml.dsautoestoque.com/?l=40889222000393&v=2
// Autonunes (Cabo): http://xml.dsautoestoque.com/?l=40889222000555&v=2
// Autonunes (Caruaru): http://xml.dsautoestoque.com/?l=40889222000806&v=2
// Autonunes (Gravatá): http://xml.dsautoestoque.com/?l=40889222000717&v=2
// Autonunes (Olinda): http://xml.dsautoestoque.com/?l=40889222000474&v=2
// Autonunes (Prazeres): http://xml.dsautoestoque.com/?l=40889222000121&v=2
// Caxangá: http://xml.dsautoestoque.com/?l=09924937000128&v=2
