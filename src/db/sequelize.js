const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");
const bcrypt = require("bcrypt");

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    "xf47r2703ogftnzl",
    "uwxau1zhu6s5vcne	",
    "yc9zoqhpk3p9v82r",
    {
      host: "cwe1u6tjijexv3r6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      dialect: "mysql",
      dialectOptions: {
        timezone: "Etc/GMT-2",
      },
      logging: true,
    }
  );
} else {
  sequelize = new Sequelize("pokedex", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: false,
  });
}

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = () => {
  if (process.env.NODE_ENV === "production") {
    return sequelize.sync().then((_) => {
      console.log("INIT DB");
      pokemons.map((pokemon) => {
        Pokemon.create({
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types,
        }).then((pokemon) => console.log(pokemon.toJSON()));
      });

      bcrypt
        .hash("pikachu", 10)
        .then((hash) =>
          User.create({
            username: "pikachu",
            password: hash,
          })
        )
        .then((user) => console.log(user.toJSON()));
      console.log("La base de donnée a bien été initialisée !");
    });
  } else {
    return sequelize.sync({ force: true }).then((_) => {
      console.log("INIT DB");
      pokemons.map((pokemon) => {
        Pokemon.create({
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types,
        }).then((pokemon) => console.log(pokemon.toJSON()));
      });

      bcrypt
        .hash("pikachu", 10)
        .then((hash) =>
          User.create({
            username: "pikachu",
            password: hash,
          })
        )
        .then((user) => console.log(user.toJSON()));
      console.log("La base de donnée a bien été initialisée !");
    });
  }
};

module.exports = {
  initDb,
  Pokemon,
  User,
};
