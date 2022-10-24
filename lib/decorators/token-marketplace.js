'use strict';
const {parseQuerys} = require('@utils/middlewares/parse-querys.js');

function decorator(controller) {
    controller.request('put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });
    

    controller.request('get', parseQuerys);
}

module.exports = decorator;
