'use strict';
const MAX_FILE_SIZE = parseInt(process.env.UPLOADS_MAX_SIZE_MB, 10) * 1048576;

function validateUploadedFile(req, res, next) {
    if (!req.file) {
        return res.status(400).json({
            code: 'invalid_file',
            message: 'Invalid file'
        });
    }
    if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            code: 'max_file_size_exceeded',
            message: 'Max file size exceeded'
        });
    }
    return next();
}

module.exports = validateUploadedFile;
