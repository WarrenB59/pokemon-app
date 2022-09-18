const validTypes = [
  "Plante",
  "Poison",
  "Feu",
  "Eau",
  "Insecte",
  "Vol",
  "Normal",
  "Electrik",
  "Fée",
  "Psy",
  "Glace",
  "Combat",
  "Sol",
  "Roche",
  "Spectre",
  "Dragon",
  "Acier",
  "Ténèbre",
];

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // Contrainte d’unicité
        unique: {
          msg: "Ce nom est déjà pris.",
        },
        validate: {
          notEmpty: { msg: "Le nom ne peut pas être vide" },
          notNull: { msg: "Le nom est une propriété requise." },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Validateurs natif sequelize
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les points de vie.",
          },
          min: {
            args: [0],
            msg: "Les points de vie doivent être supérieur ou égal à 0.",
          },
          max: {
            args: [999],
            msg: "Les points de vie doivent être inférieur ou égal à 999.",
          },
          notNull: { msg: "Les points de vie sont une propriété requise." },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les points de dégâts.",
          },
          min: {
            args: [0],
            msg: "Les points de dégâts doivent être supérieur ou égal à 0.",
          },
          max: {
            args: [99],
            msg: "Les points de dégâts doivent être inférieur ou égal à 99.",
          },
          notNull: { msg: "Les points de dégâts sont une propriété requise." },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {
            msg: "Utilisez uniquement une URL pour l'image du Pokémon.",
          },
          notNull: { msg: "L'URL est une propriété requise." },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          return this.setDataValue("types", types.join());
        },
        // Validateur personnalisé
        validate: {
          isTypesValid(value) {
            if (!value) {
              throw new Error("Un Pokémon doit au moins avoir un type.");
            }
            if (value.split(",").length > 3) {
              throw new Error("Un Pokémon ne peut pas avoir plus de 3 types.");
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type de Pokémon doit appartenir à la liste suivante : ${validTypes}`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};
