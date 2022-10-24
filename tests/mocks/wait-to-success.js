'use strict';

function waitToSuccess(func, tries, interval) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            func()
                .catch(() => {
                    return false;
                })
                .then((result) => {
                    if (result) {
                        return resolve();
                    }
                    if (tries === 0) {
                        return reject();
                    }
                    return waitToSuccess(func, tries - 1, interval)
                        .then(resolve)
                        .catch(reject);
                });
        }, interval);
    });
}

module.exports = waitToSuccess;
