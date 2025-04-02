const {
    creerCategorieTaille,
    obtenirToutesLesCategories
} = require("../controllers/categorieTailleController");

module.exports = (app) => {
    // Créer une catégorie de taille
    app.post("/api/categories", creerCategorieTaille);

    // Obtenir toutes les catégories de taille
    app.get("/api/categories", obtenirToutesLesCategories);
};
