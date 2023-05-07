module.exports = {
    port: 3001,
    tokenTTL: 60 * 10 * 1000, // 10 minutes; 60 seconds * 10 minutes * 1000 milliseconds
    publicPaths: [
        { method: 'POST', path: '/api/session' },
        { method: 'GET', path: '/login.html' },
    ],
};
