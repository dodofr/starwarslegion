const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Définition des dossiers en fonction du type d'entité
const getUploadPath = (req, file) => {
    if (file.mimetype.startsWith('image/')) {
        if (req.baseUrl.includes('cadrans')) return 'uploads/images/cadran/';
        if (req.baseUrl.includes('vaisseaux')) return 'uploads/images/vaisseau/';
        if (req.baseUrl.includes('cartes')) return 'uploads/images/carte/';
        return 'uploads/images/autres/';
    } else if (file.mimetype === 'application/json') {
        return 'uploads/configs/';
    } else if (file.mimetype === 'application/pdf') {
        return 'uploads/documents/';
    }
    return null;
};

// Création du dossier si inexistant
const ensureDirectoryExistence = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = getUploadPath(req, file);
        if (uploadPath) {
            ensureDirectoryExistence(uploadPath);
            cb(null, uploadPath);
        } else {
            cb(new Error('Format de fichier non supporté'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/json', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non supporté'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
