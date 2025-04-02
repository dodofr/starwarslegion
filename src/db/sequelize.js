const { Sequelize, DataTypes } = require("sequelize");

// Importer les modèles
const VaisseauModel = require("../models/vaisseau");
const CadranModel = require("../models/cadran");
const CarteModel = require("../models/carte");
const FactionModel = require("../models/faction");
const CategorieTailleModel = require("../models/categorieTaille");
const ImageVaisseauModel = require("../models/imageVaisseau"); // Import du modèle ImageVaisseau

// Créer la connexion à la base de données MariaDB
const sequelize = new Sequelize(`mariadb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    dialectOptions: {
        connectTimeout: 60000, // Augmenter le délai d'attente à 60 secondes
    }
});

// Initialisation des modèles
const Vaisseau = VaisseauModel(sequelize, DataTypes);
const Cadran = CadranModel(sequelize, DataTypes);
const Carte = CarteModel(sequelize, DataTypes);
const Faction = FactionModel(sequelize, DataTypes);
const CategorieTaille = CategorieTailleModel(sequelize, DataTypes);
const ImageVaisseau = ImageVaisseauModel(sequelize, DataTypes); // Initialisation du modèle ImageVaisseau

// Appeler les fonctions d'association pour chaque modèle
Vaisseau.associate({ Faction, Cadran, Carte, CategorieTaille, ImageVaisseau }); // Ajout de la relation avec ImageVaisseau
Cadran.associate({ Vaisseau });
Carte.associate({ Vaisseau });
Faction.associate({ Vaisseau });
CategorieTaille.associate({ Vaisseau });
ImageVaisseau.associate({ Vaisseau }); // L'association entre ImageVaisseau et Vaisseau

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
    Vaisseau,
    Cadran,
    Carte,
    Faction,
    CategorieTaille,
    ImageVaisseau // Ajout du modèle ImageVaisseau à l'export
};
