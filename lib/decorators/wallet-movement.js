'use strict';
const isAdmin = require('@middlewares/is-admin');

function decorator(controller) {
    controller.request('put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    /**
    * @name Get wallet movements
    * @description Get all wallet movements. Should have admin role
    * @route {GET} /api/walletmovements
    * @queryparam {string} [authTimestamp] Admin validation - timestamp of request (estimated)
    * @queryparam {string} [authSignature] Admin validation - authTimestamp signed with user private key
    * @queryparam (optional) {string} [populate] Fields to populate
    * @queryparam (optional) {object} [conditions] Conditions to filter
    * @queryparam (optional) {number} [skip] Documents to skip
    * @queryparam (optional) {number} [limit] Max quantity of documents to return
    * @queryparam (optional) {string} [sort] Fields to sort
    * @response {200} OK
    * @responsebody {array<object>} [*] Array of results
    * @responsebody {string} [[]._id] Unique identifier
    * @responsebody {string} [[].type] Movement type
    * @responsebody {string} [[].walletAddress] Address of the user wallet
    * @responsebody {string} [[].vault] Identifier related to Vault (could be object if its populated)
    * @responsebody {string} [[].transactionHash] Hash of the movement transaction
    * @responsebody {number} [[].amount] Amount of movement
    * @responsebody {string} [[].status] Movement status
    */
    controller.request('get', isAdmin);
}

module.exports = decorator;
