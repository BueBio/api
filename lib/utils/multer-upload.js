'use strict';
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.UPLOADS_FOLTER);
    },
    filename: (req, file, callback) => {
        const parts = file.originalname.split('.');
        const extension = parts[parts.length - 1];
        let name = file.originalname.substring(0, file.originalname.length - extension.length - 1);
        name = name.normalize('NFD')
            .replace(/[^a-zA-Z0-9]/g, '_')
            .toLowerCase();
        callback(null, `${new Date().getTime()}_${name}.${extension}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.UPLOADS_MAX_SIZE_MB, 10) * 1048576
    }
});

module.exports = upload;
