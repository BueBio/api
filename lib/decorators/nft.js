'use strict';
const {parsePopulate} = require('@utils/middlewares/general');

function decorator(controller) {
    controller.request('put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });
    
    controller.request('get', parsePopulate);
}

module.exports = decorator;
