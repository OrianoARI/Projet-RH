const multer = require('multer');



const storage = multer.diskStorage({//Configuration Multer pour définir l'emplacement de stockage des images. Ici, stockage dans le dossier "uploads" :
    destination: function (req, file, cb) {
        cb(null, './assets/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);  //définition du nom du fichier avec l'iD admin+nom du fichier  
    }
});

const upload = multer({ storage: storage });


module.exports = upload;