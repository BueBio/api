'use strict';
const publicPaths = {
    get: [
        'api/tokenmarketplaces',
        'api/codes/validate',
        'api/codes/wallet/',
        'api/future/production/offers',
        'api/future/production/offers/:id',
        'api/coins'
    ],
    put: [],
    post: ['api/auth', 'api/tokens/impacttoken/assign'],
    delete: []
};

function regex(method) {
    const prefix = '^\/';
    const pathRegexStr = prefix + publicPaths[method.toLowerCase()].map((path) => {
        return `(?!${path})`;
    }).join('') + '.*';
    return new RegExp(pathRegexStr, 'i');
}

module.exports = {
    regex
};
