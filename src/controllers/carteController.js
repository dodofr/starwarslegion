const { Carte, Vaisseau } = require('../db/sequelize');

async function creerCarte(req, res) {
    try {
        const { nom, attaque, defense, bouclier, vaisseauxIds } = req.body;
        
        // Création de la carte
        const nouvelleCarte = await Carte.create({ nom, attaque, defense, bouclier });

        // Associer les vaisseaux si des IDs sont fournis
        if (vaisseauxIds && vaisseauxIds.length > 0) {
            const vaisseaux = await Vaisseau.findAll({ where: { id: vaisseauxIds } });
            await nouvelleCarte.setVaisseaux(vaisseaux);
        }

        res.status(201).json(nouvelleCarte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirToutesLesCartes(req, res) {
    try {
        const cartes = await Carte.findAll({
            include: [{ model: Vaisseau, through: { attributes: [] } }] // Inclut les vaisseaux associés
        });
        res.status(200).json(cartes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirCarteParId(req, res) {
    try {
        const { id } = req.params;
        const carte = await Carte.findByPk(id, {
            include: [{ model: Vaisseau, through: { attributes: [] } }] // Inclut les vaisseaux associés
        });

        if (!carte) {
            return res.status(404).json({ message: "Carte non trouvée" });
        }

        res.status(200).json(carte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function mettreAJourCarte(req, res) {
    try {
        const { id } = req.params;
        const { nom, attaque, defense, bouclier, vaisseauxIds } = req.body;

        const carte = await Carte.findByPk(id);
        if (!carte) {
            return res.status(404).json({ message: "Carte non trouvée" });
        }

        // Mise à jour des champs
        await carte.update({ nom, attaque, defense, bouclier });

        // Mise à jour des relations avec les vaisseaux
        if (vaisseauxIds) {
            const vaisseaux = await Vaisseau.findAll({ where: { id: vaisseauxIds } });
            await carte.setVaisseaux(vaisseaux);
        }

        res.status(200).json(carte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function supprimerCarte(req, res) {
    try {
        const { id } = req.params;
        const carte = await Carte.findByPk(id);

        if (!carte) {
            return res.status(404).json({ message: "Carte non trouvée" });
        }

        // Suppression de la carte
        await carte.destroy();
        res.status(204).json({ message: "Carte supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    creerCarte,
    obtenirToutesLesCartes,
    mettreAJourCarte, 
    obtenirCarteParId, 
    supprimerCarte
};
