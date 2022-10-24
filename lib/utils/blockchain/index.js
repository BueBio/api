'use strict';
const {ethers, BigNumber} = require('ethers');
const logger = require('@lib/logger');
const ImpactToken = require('./impact-token');
const FutureToken = require('./future-token');
const Marketplace = require('./marketplace');
const Erc20Token = require('./erc20-token');
const BLOCKCHAIN_NETWORK_RPC = process.env.BLOCKCHAIN_NETWORK_RPC;
const BLOCKCHAIN_BUEBIO_PRIVATE_KEY = process.env.BLOCKCHAIN_BUEBIO_PRIVATE_KEY;
const INTERVAL_SECONDS = parseInt(process.env.BLOCKCHAIN_LISTEN_TRANSACTION_INTERVAL_SECONDS || 5);
let connection;
let objImpactToken;
let objFutureToken;
let objMarketplace;

function waitEvents() {
    objMarketplace.waitEventPublish();
    objMarketplace.waitEventUnpublish();
    objMarketplace.waitEventBuy();
}

async function initialize() {
    connection = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_NETWORK_RPC);
    logger.info(`[BLOCKCHAIN] Connected to ${BLOCKCHAIN_NETWORK_RPC}`);
    const wallet = new ethers.Wallet(BLOCKCHAIN_BUEBIO_PRIVATE_KEY, connection);
    objImpactToken = new ImpactToken(connection, wallet);
    objFutureToken = new FutureToken(connection, wallet);
    objMarketplace = new Marketplace(connection, wallet);
    waitEvents();
}

function waitSeconds(secondsToWait) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, secondsToWait * 1000);
    });
}

async function waitForTransaction(transactionHash) {
    let withResult = false;
    let success;
    let data;
    while (!withResult) {
        await connection.getTransactionReceipt(transactionHash)
            .then((response) => {
                if (!response) {
                    return waitSeconds(INTERVAL_SECONDS);
                }
                withResult = true;
                success = true;
                data = response;
                return null;
            });
    }
    return {success, data};
}

function balanceFromAddress(address) {
    return connection.getBalance(address);
}

function impactToken() {
    return objImpactToken;
}

function futureToken() {
    return objFutureToken;
}

function erc20Token(contractAddress) {
    return new Erc20Token(connection, contractAddress);
}

function urlJsonOfToken(tokenType, id) {
    let urlBase = '-';
    switch (tokenType) {
        case 'impactToken':
            urlBase = process.env.BLOCKCHAIN_SC_IMPACTTOKEN_URLJSON;
            break;
        case 'futureToken':
            urlBase = process.env.BLOCKCHAIN_SC_FUTURETOKEN_URLJSON;
            break;
    }
    return urlBase.replace('{id}', id);
}

function formatTokenAmount(amount, decimals) {
    return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
}

module.exports = {
    initialize,
    impactToken,
    futureToken,
    waitForTransaction,
    balanceFromAddress,
    erc20Token,
    urlJsonOfToken,
    formatTokenAmount
};
