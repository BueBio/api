'use strict';
const schedule = require('node-schedule');
const processBlockchainTransactions = require('@utils/schedules/process-blockchain-transactions');
const runningProcesses = new Set();

function runSchedule(name, func) {
    if (runningProcesses.has(name)) {
        return false;
    }
    runningProcesses.add(name);
    return func()
        .catch(() => {
            return;
        })
        .then(() => {
            runningProcesses.delete(name);
        });
}

function initSchedule() {
    schedule.scheduleJob('* * * * *', () => {
        return runSchedule('processBlockchainTransactions', processBlockchainTransactions);
    });
}

module.exports = initSchedule;
