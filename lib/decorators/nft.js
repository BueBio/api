'use strict';
const {parsePopulate} = require('@utils/middlewares/general');

function decorator(controller) {
    controller.request('put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    /**
    * @name Get nfts
    * @description Get all nfts
    * @route {GET} /api/nfts
    * @queryparam (optional) {string} [populate] Fields to populate
    * @queryparam (optional) {object} [conditions] Conditions to filter
    * @queryparam (optional) {number} [skip] Documents to skip
    * @queryparam (optional) {number} [limit] Max quantity of documents to return
    * @queryparam (optional) {string} [sort] Fields to sort
    * @response {200} OK
    * @responsebody {array<object>} [*] Array of results
    * @responsebody {string} [[]._id] Unique identifier
    * @responsebody {string} [[].name] Name
    * @responsebody {string} [[].vault] Identifier related to Vault (could be object if its populated)
    * @responsebody {string} [[].address] Smart contract address
    * @responsebody {string} [[].image] Identifier related to File (could be object if its populated)
    */
    controller.request('get', parsePopulate);
}

module.exports = decorator;
