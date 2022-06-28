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
    * @name Get vaults
    * @description Get all vaults
    * @route {GET} /api/vaults
    * @queryparam (optional) {string} [populate] Fields to populate
    * @queryparam (optional) {object} [conditions] Conditions to filter
    * @queryparam (optional) {number} [skip] Documents to skip
    * @queryparam (optional) {number} [limit] Max quantity of documents to return
    * @queryparam (optional) {string} [sort] Fields to sort
    * @response {200} OK
    * @responsebody {array<object>} [*] Array of results
    * @responsebody {string} [[]._id] Unique identifier
    * @responsebody {string} [[].name] Name
    * @responsebody {string} [[].description] Description
    * @responsebody {number} [[].scoring] Scoring
    * @responsebody {number} [[].apy] APY percentage
    * @responsebody {string} [[].image] Identifier related to File (could be object if its populated)
    * @responsebody {string} [[].walletAddress] Address of the owner wallet, should receive deposits
    * @responsebody {string} [[].coinAddress] Address of the token that take part in the vault
    */
    controller.request('get', parsePopulate);
}

module.exports = decorator;

