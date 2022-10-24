'use strict';

function addUploadedFileInBody(req, res, next) {
    req.body.originalname = req.file.originalname;
    req.body.filename = req.file.filename;
    req.body.mimetype = req.file.mimetype;
    req.body.size = req.file.size;
    return next();
}

module.exports = addUploadedFileInBody;
