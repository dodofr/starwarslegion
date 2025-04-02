const upload = require('../upload/upload');  // Importation du middleware multer

const {
    creerVaisseau,
    obtenirTousLesVaisseaux,
    obtenirVaisseauParId,
    mettreAJourVaisseau,
    supprimerVaisseau
} = require('../controllers/vaisseauController');

module.exports = (app) => {
    // Route pour créer un vaisseau avec téléchargement de plusieurs fichiers images
    app.post("/api/vaisseaux", 
        upload.array('images', 10), // accepter jusqu'à 10 images
        creerVaisseau
    );

    // Route pour obtenir tous les vaisseaux
    app.get('/api/vaisseaux', obtenirTousLesVaisseaux);

    // Route pour obtenir un vaisseau par ID
    app.get('/api/vaisseaux/:id', obtenirVaisseauParId);

    // Route pour mettre à jour un vaisseau avec téléchargement de plusieurs images
    app.put("/api/vaisseaux/:id", 
        upload.array('images', 10),  // possibilité de télécharger plusieurs images
        mettreAJourVaisseau
    );

    // Route pour supprimer un vaisseau (les images seront supprimées dans le contrôleur)
    app.delete('/api/vaisseaux/:id', supprimerVaisseau);
};
