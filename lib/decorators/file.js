'use strict';
const multerUpload = require('@utils/multer-upload');
const validateUploadedFile = require('@utils/middlewares/files/validate-uploaded-file');
const addUploadedFileInBody = require('@utils/middlewares/files/add-uploaded-file-in-body');

function decorator(controller) {
    controller.request('get put delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    controller.request('post', multerUpload.single('file'));
    controller.request('post', validateUploadedFile);
    controller.request('post', addUploadedFileInBody);
}

module.exports = decorator;
