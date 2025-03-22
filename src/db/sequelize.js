const { Sequelize, DataTypes } = require("sequelize");
const EbookModel = require("../models/ebooks");
const CategorieModel = require("../models/categorie");
const SerieModel = require("../models/serie");
const BibliothequeModel = require("../models/bibliotheque");
const UserModel = require("../models/user");
const AuteurModel = require('../models/auteur');

const sequelize = new Sequelize(`mariadb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3305/${process.env.DB_NAME}`, {
    dialectOptions: {
        connectTimeout: 60000, // Augmenter le délai d'attente à 60 secondes
    }
});

// Initialisation des modèles
const Ebook = EbookModel(sequelize, DataTypes);
const Serie = SerieModel(sequelize, DataTypes);
const Categorie = CategorieModel(sequelize, DataTypes);
const Bibliotheque = BibliothequeModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Auteur = AuteurModel(sequelize, DataTypes);

// Appeler les fonctions d'association
Ebook.associate({ Serie, Categorie, User, Bibliotheque,Auteur });
Serie.associate({ Ebook });
Categorie.associate({ Ebook });
User.associate({ Bibliotheque, Ebook });
Bibliotheque.associate({ User, Ebook });
Auteur.associate({ Ebook });

// Fonction d'initialisation/synchronisation de la base de données
const initDb = async () => {
    try {
        await sequelize.authenticate(); // Vérifie la connexion
        console.log("Connexion à la base de données réussie.");
        
        await sequelize.sync({ force: true }); // force: false pour ne pas supprimer les données existantes
        console.log("La base de données a bien été initialisée !");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
    }
};

module.exports = {
    initDb,
    Ebook,
    Serie,
    Categorie,
    User,
    Bibliotheque,
    Auteur
};
