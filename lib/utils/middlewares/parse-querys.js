'use strict';

function addQuerySort(optionsQuery, parameters) {
    if (parameters.sort) {
        const order = parameters.sort;
        let sortParse;
        if (order.charAt(0) === '-') {
            sortParse = [[order.replace('-', ''), 'desc']];
        } else {
            sortParse = [[order, 'asc']];
        }
        optionsQuery.order = sortParse;
    }
}

function parseQuerys(req, res, next) {
    let query = {
        limit: 10,
        offset:0
    };

    if (req.query.limit) {
        query.limit = req.query.limit;
    }
    if (req.query.skip) {
        query.offset = req.query.skip;
    }
    addQuerySort(query, req.query);
    req.parameters = query;
    return next();
}

module.exports = {
    parseQuerys
};
