const { ImageVaisseau, Vaisseau } = require('../db/sequelize');
const path = require('path');

async function creerImageVaisseau(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image envoyée" });
        }

        const { vaisseauId } = req.body;
        const imageUrl = path.join('uploads/images/vaisseau/', req.file.filename);

        // Vérifier si le vaisseau existe
        const vaisseau = await Vaisseau.findByPk(vaisseauId);
        if (!vaisseau) {
            return res.status(404).json({ message: "Vaisseau non trouvé" });
        }

        const nouvelleImage = await ImageVaisseau.create({ url: imageUrl, vaisseauId });
        res.status(201).json(nouvelleImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirToutesLesImages(req, res) {
    try {
        const images = await ImageVaisseau.findAll({ include: Vaisseau });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function obtenirImageParId(req, res) {
    try {
        const { id } = req.params;
        const image = await ImageVaisseau.findByPk(id, { include: Vaisseau });

        if (!image) {
            return res.status(404).json({ message: "Image non trouvée" });
        }

        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function mettreAJourImage(req, res) {
    try {
        const { id } = req.params;
        const { vaisseauId } = req.body;
        let newImageUrl = null;

        const image = await ImageVaisseau.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: "Image non trouvée" });
        }

        if (vaisseauId) {
            const vaisseau = await Vaisseau.findByPk(vaisseauId);
            if (!vaisseau) {
                return res.status(404).json({ message: "Vaisseau non trouvé" });
            }
        }

        if (req.file) {
            newImageUrl = path.join('uploads/images/vaisseau/', req.file.filename);
        }

        await image.update({ url: newImageUrl || image.url, vaisseauId });
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function supprimerImage(req, res) {
    try {
        const { id } = req.params;
        const image = await ImageVaisseau.findByPk(id);

        if (!image) {
            return res.status(404).json({ message: "Image non trouvée" });
        }

        await image.destroy();
        res.status(204).json({ message: "Image supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    creerImageVaisseau,
    obtenirToutesLesImages,
    obtenirImageParId,
    mettreAJourImage,
    supprimerImage
};
