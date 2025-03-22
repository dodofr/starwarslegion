const multer = require('multer');
const path = require('path');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/epub+zip' || file.mimetype === 'application/x-mobipocket-ebook') {
            cb(null, 'uploads/ebooks/'); // Dossier de stockage des fichiers ebook
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/couvertures/'); // Dossier de stockage des images
        } else {
            cb(new Error('Seuls les fichiers PDF, EPUB, MOBI et les images (JPEG/PNG) sont autorisés'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtrage des fichiers par type
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/x-mobipocket-ebook',
        'image/jpeg',
        'image/png'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non supporté'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
