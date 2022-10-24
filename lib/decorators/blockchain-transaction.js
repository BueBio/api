'use strict';

function decorator(controller) {
    controller.request('get put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });
}

module.exports = decorator;
