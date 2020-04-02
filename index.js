const axios = require("axios");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const parseString = require("xml2js").parseString;
const util = require("util");

const fsp = fs.promises;
const app = express();
const readdir = util.promisify(fs.readdir);

const lojas = [
  {
    nome: "Auto_Oriente_Caruaru",
    url: "http://xml.dsautoestoque.com/?l=14989426000396&v=2"
  },
  {
    nome: "Auto_Oriente_Recife",
    url: "http://xml.dsautoestoque.com/?l=14989426000124&v=2"
  },
  {
    nome: "Autonunes_Boa_Viagem",
    url: "http://xml.dsautoestoque.com/?l=40889222000393&v=2"
  },
  {
    nome: "Autonunes_Cabo",
    url: "http://xml.dsautoestoque.com/?l=40889222000555&v=2"
<<<<<<< HEAD
  }
  // {
  //   nome: "Caxanga",
  //   url: "http://xml.dsautoestoque.com/?l=09924937000128&v=2"
  // }
=======
  },
  {
    nome: "Caxanga",
    url: "http://xml.dsautoestoque.com/?l=09924937000128&v=2"
  },
  {
    nome: "Autonunes_Caruaru",
    url: "http://xml.dsautoestoque.com/?l=40889222000806&v=2"
  },
  {
    nome: "Autonunes_Gravata",
    url: "http://xml.dsautoestoque.com/?l=40889222000717&v=2"
  },
  {
    nome: "Autonunes_Olinda",
    url: "http://xml.dsautoestoque.com/?l=40889222000474&v=2"
  },
  {
    nome: "Autonunes_Prazeres",
    url: "http://xml.dsautoestoque.com/?l=40889222000121&v=2"
  }
>>>>>>> 30023211fe4dce7ad153aefac4cdfe839b0cdea3
];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function getLojaInfo(nome, url) {
  try {
    const response = await axios.get(url);

    const data = response.data;
    // const today = new Date();
    const fileName = nome;
    fs.writeFile(__dirname + "/files/" + fileName, data, function(err) {
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

app.get("/", async function(req, res) {
<<<<<<< HEAD
  const year = req.query.year;
=======
>>>>>>> 30023211fe4dce7ad153aefac4cdfe839b0cdea3
  const files = await readdir(__dirname + "/files");

  const promise = await files.map(async file => {
    const data = await fsp.readFile(__dirname + "/files/" + file);
    const parsedData = data.toString();
    let content;
    await parseString(parsedData, function(err, result) {
      content = result;
    });
<<<<<<< HEAD
    if (year) {
      const filteredContent = await content.estoque.veiculo.filter(carro => {
        return carro.anomodelo[0] === year;
      });
      content.estoque.veiculo = filteredContent;
    }

    return content;
  });
=======

    return content;
  });

  const content = await Promise.all(promise);

  res.send(content);
});

app.get("/:id", async function(req, res) {
  const files = await readdir(__dirname + "/files");
  const { id } = req.params;

  const promise = await files
    .filter(file => {
      if (file === lojas[id].nome) {
        return true;
      }
      return false;
    })
    .map(async file => {
      const data = await fsp.readFile(__dirname + "/files/" + file);
      const parsedData = data.toString();
      let content;
      await parseString(parsedData, function(err, result) {
        content = result;
      });

      return content;
    });
>>>>>>> 30023211fe4dce7ad153aefac4cdfe839b0cdea3

  const content = await Promise.all(promise);

  res.send(content);
});

app.get("/updateFiles", async function(req, res) {
<<<<<<< HEAD
  await lojas.forEach(async loja => {
    await getLojaInfo(loja.nome, loja.url);
  });
  return res.send({ hello: "world" });
=======
  try {
    await lojas.forEach(async loja => {
      await getLojaInfo(loja.nome, loja.url);
    });
  } catch (err) {
    throw new Error(err);
  }

  return res.send("Arquivos atualizados");
>>>>>>> 30023211fe4dce7ad153aefac4cdfe839b0cdea3
});

app.use(cors());

app.use(bodyParser.json());

app.listen(process.env.PORT || 3333);
<<<<<<< HEAD

// Auto Oriente (Caruaru): http://xml.dsautoestoque.com/?l=14989426000396&v=2
// Auto Oriente (Recife): http://xml.dsautoestoque.com/?l=14989426000124&v=2
// Autonunes Boa Viagem: http://xml.dsautoestoque.com/?l=40889222000393&v=2
// Autonunes (Cabo): http://xml.dsautoestoque.com/?l=40889222000555&v=2
// Autonunes (Caruaru): http://xml.dsautoestoque.com/?l=40889222000806&v=2
// Autonunes (Gravatá): http://xml.dsautoestoque.com/?l=40889222000717&v=2
// Autonunes (Olinda): http://xml.dsautoestoque.com/?l=40889222000474&v=2
// Autonunes (Prazeres): http://xml.dsautoestoque.com/?l=40889222000121&v=2
// Caxangá: http://xml.dsautoestoque.com/?l=09924937000128&v=2
=======
>>>>>>> 30023211fe4dce7ad153aefac4cdfe839b0cdea3
