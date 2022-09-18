const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const sequelize = require("./src/db/sequelize");

const app = express();

/* 
Port 3000 pour variable locale car process.env.PORT vaudra "undefined" en environnement dev
En environnement prod, la variable "port" aura pour valeur celle attribuée dynamiquement par Heroku 
*/
const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});

// Middleware homemade
/*
app.use((req, res, next) => {
  console.log(`URL : ${req.url}`);
  next();
});
*/

// Middleware implémenté grâce au module Morgan
app.use(favicon(__dirname + "/assets/favicon.ico")).use(bodyParser.json());

sequelize.initDb();

app.get("/", (req, res) => {
  res.json("Hello, Heroku!");
});

// Ici, nous placerons nos futurs endpoints.
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);
require("./src/routes/login")(app);

// On ajoute la gestion des erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de retrouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(`Application fonctionne sur : http://localhost:${port}`)
);
