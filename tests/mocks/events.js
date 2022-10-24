'use strict';
const events = require('@utils/events-emitter');

function reset() {
    events.removeAllListeners();
}

function listen(key, callback) {
    events.on(key, callback);
}

module.exports = {
    reset,
    listen
};
