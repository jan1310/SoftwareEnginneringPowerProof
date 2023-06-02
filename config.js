module.exports = {
    port: process.env.PORT || 3001,
    tokenTTL: 60 * 10 * 1000, // 10 minutes; 60 seconds * 10 minutes * 1000 milliseconds
    publicPaths: [
        { method: 'POST', path: '/api/session' },
        { method: 'POST', path: '/api/user' },
        { method: 'GET', path: '/login.html' },
        { method: 'GET', path: '/register.html' },
        { method: 'GET', path: '/http.js' },
        { method: 'GET', path: '/bulma.min.css' },
    ],
    databaseConnection: 'postgres://jschiffer:_jschiffer_se2023!@kdb.sh:6082/jschiffer',
    cookieSecret: '96c73f2ba9478086',
    cookieName: 'hsw-chat-auth',
};
