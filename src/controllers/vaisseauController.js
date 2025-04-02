const { Vaisseau, ImageVaisseau, Faction, CategorieTaille, Cadran } = require('../db/sequelize');
const fs = require('fs');
const path = require('path');

async function creerVaisseau(req, res) {
    try {
        const { nom, description, factionNom, categorieTailleId, cadranId } = req.body;
        const imageVaisseaux = req.files['images'] ? req.files['images'].map(file => `uploads/vaisseaux/${file.filename}`) : [];

        // Gestion de la faction
        let faction = await Faction.findOne({ where: { nom: factionNom } });
        if (!faction) {
            faction = await Faction.create({ nom: factionNom });
        }

        // Création du vaisseau avec une image principale (première image si dispo)
        const newVaisseau = await Vaisseau.create({
            nom,
            description,
            categorieTailleId,
            cadranId,
            image: imageVaisseaux.length > 0 ? imageVaisseaux[0] : null
        });

        // Ajouter les images associées au vaisseau
        for (const image of imageVaisseaux) {
            await ImageVaisseau.create({ url: image, vaisseauId: newVaisseau.id });
        }

        res.status(201).json(newVaisseau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirTousLesVaisseaux(req, res) {
    try {
        const vaisseaux = await Vaisseau.findAll({
            include: [
                { model: Faction, attributes: ['nom'] },
                { model: CategorieTaille, attributes: ['nom'] },
                { model: Cadran, attributes: ['nom'] },
                { model: ImageVaisseau, attributes: ['url'] }
            ]
        });
        res.status(200).json(vaisseaux);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirVaisseauParId(req, res) {
    try {
        const { id } = req.params;
        const vaisseau = await Vaisseau.findByPk(id, {
            include: [
                { model: Faction, attributes: ['nom'] },
                { model: CategorieTaille, attributes: ['nom'] },
                { model: Cadran, attributes: ['nom'] },
                { model: ImageVaisseau, attributes: ['url'] }
            ]
        });

        if (!vaisseau) {
            return res.status(404).json({ message: "Vaisseau non trouvé" });
        }

        res.status(200).json(vaisseau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function mettreAJourVaisseau(req, res) {
    try {
        const { id } = req.params;
        const { nom, description, factionNom, categorieTailleId, cadranId } = req.body;
        const imageVaisseaux = req.files['images'] ? req.files['images'].map(file => `uploads/vaisseaux/${file.filename}`) : [];

        const vaisseau = await Vaisseau.findByPk(id, {
            include: [{ model: ImageVaisseau }]
        });

        if (!vaisseau) {
            return res.status(404).json({ message: "Vaisseau non trouvé" });
        }

        await vaisseau.update({
            nom,
            description,
            categorieTailleId,
            cadranId,
            image: imageVaisseaux.length > 0 ? imageVaisseaux[0] : vaisseau.image
        });

        // Supprimer les anciennes images
        await ImageVaisseau.destroy({ where: { vaisseauId: vaisseau.id } });

        // Ajouter les nouvelles images
        for (const image of imageVaisseaux) {
            await ImageVaisseau.create({ url: image, vaisseauId: vaisseau.id });
        }

        const updatedVaisseau = await Vaisseau.findByPk(id, {
            include: [{ model: Faction }, { model: CategorieTaille }, { model: Cadran }, { model: ImageVaisseau }]
        });

        res.status(200).json(updatedVaisseau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function supprimerVaisseau(req, res) {
    try {
        const { id } = req.params;
        const vaisseau = await Vaisseau.findByPk(id, {
            include: [{ model: ImageVaisseau }]
        });

        if (!vaisseau) {
            return res.status(404).json({ message: "Vaisseau non trouvé" });
        }

        // Supprimer les images associées
        for (const img of vaisseau.ImageVaisseaus) {
            const imagePath = path.join(__dirname, '../../uploads/vaisseaux', path.basename(img.url));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            await img.destroy();
        }

        await vaisseau.destroy();
        res.status(204).json({ message: "Vaisseau et images supprimés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    creerVaisseau,
    obtenirTousLesVaisseaux,
    obtenirVaisseauParId,
    mettreAJourVaisseau,
    supprimerVaisseau
};
