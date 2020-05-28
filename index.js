const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const CarController = require("./controllers/CarController");
const SingleCarController = require("./controllers/SingleCarController");
const MarcaController = require("./controllers/MarcaController");
const UpdateController = require("./controllers/UpdateController");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.post("/", CarController.index);
app.get("/", SingleCarController.index);
app.get("/marcas", MarcaController.index);
app.get("/atualizar", UpdateController.store);

app.use(cors());

// CRON JOB EXECUTANDO DE UM EM UM MINUTO
// cron.schedule("0 */1 * * *", () => {
//   console.log("Executando a tarefa a cada 1 hora");
//   UpdateController.store();
// });

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

// Body do get /
// {
// 	"yearRange": [2017,2020],
// 	"priceRange": [20000,90000],
// 	"colors": ["azul", "preto", "cinza"],
// 	"kmRange": [0, 100000],
// 	"cambio": "Automático",
// 	"marca": "chevrolet",
//  "combustivel": "Flex",
// "opcionais": ["Air bag", "Ar condicionado", "Banco de couro"]
// }
