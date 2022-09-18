const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/pokemons", auth, (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      const limit = parseInt(req.query.name) || 5;

      if (name.length < 2) {
        const message =
          "Le terme de recherche doit contenir au moins deux caractères";
        return res.status(400).json({ message });
      }

      return Pokemon.findAndCountAll({
        where: {
          // 'name' est la propriété du modèle Pokémon
          name: {
            // 'name' est le critère de la recherche
            [Op.like]: `%${name}%`,
          },
        },
        order: ["name"],
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} Pokémon qui correspond(ent) au terme de la recherche ${name}.`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message =
            "La liste des Pokémon n'a pas pu être récupérée. Réessayez dans quelques instants.";
          res.status(500).json({ message, data: error });
        });
    }
  });
};
