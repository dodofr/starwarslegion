require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');

const app = express();
const port = process.env.PORT || 3000;  // Utilisation de la variable d'environnement pour le port

// Autoriser la connexion
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON et logger les requêtes
app.use(bodyParser.json());
app.use(morgan('dev'));

// Importer les routes
require('./src/routes/vaisseauRoutes')(app);
require('./src/routes/factionroutes')(app);
require('./src/routes/categorieTailleRoutes')(app);
require('./src/routes/cadranRoutes')(app);
require('./src/routes/carteRoutes')(app);
require('./src/routes/imageVaisseauRoutes')(app);

// Initialiser la base de données (environnement de développement uniquement)
if (process.env.NODE_ENV !== 'test') {
    sequelize.initDb()
        .then(() => console.log('Base de données initialisée avec succès.'))
        .catch((error) => console.error('Erreur lors de l\'initialisation de la base de données :', error));
}

// Middleware pour gérer les erreurs 404 (ressource non trouvée)
app.use((req, res, next) => {
    const message = "Nous n'avons pas trouvé la ressource demandée";
    res.status(404).json({ message });
});

// Middleware global pour capturer les erreurs non gérées
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log de l'erreur dans la console
    res.status(500).json({ message: "Une erreur interne est survenue. Veuillez réessayer plus tard." });
});

// Démarrage du serveur (évite de démarrer en mode test)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Serveur démarré sur http://localhost:${port}`);
    });
}

module.exports = app;
