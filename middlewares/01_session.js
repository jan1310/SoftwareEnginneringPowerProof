const session = require('../services/session');
const config = require('../config');
const constants = require('../services/constants');

const log = function (text) {
    console.log(`[SESSION MIDDLEWARE]: [${requestNum}] ${text}`);
};

let requestNum = 0;

module.exports = async function (app) {
    app.use(async function (req, res, next) {
        ++requestNum;

        const now = Date.now();
        const method = req.method;
        const path = req.path;
        const db = await req.app.get('db');

        res.on('finish', () => {
            log(
                `${method} ${path} [${res.statusCode}] took ${
                    Date.now() - now
                } ms`,
            );
        });

        log(`INCOMING ${method} ${path}`);

        const isPublicPath = config.publicPaths.find(
            (p) => p.method === method && p.path === path,
        );

        if (!isPublicPath) {
            const token = req.cookies[config.cookieName];
            const userSession = await session.getSession(token, db);

            if (!userSession) {
                log(
                    `${method} ${path} is not public and no session was found.`,
                );

                if (!path.startsWith('/api')) {
                    log(`Non-API path ${method} ${path}, redirecting to login`);
                    return res.redirect('/login.html');
                } else {
                    return res
                        .status(401)
                        .json({
                            error: true,
                            code: constants.NO_SESSION,
                            isPublic: false,
                        })
                        .end();
                }
            } else {
                await session.prolongSession(token, db);
                req.session = userSession;
                log(
                    `${method} ${path} valid session ${JSON.stringify(
                        userSession,
                    )}`,
                );
            }
        } else {
            log(`${method} ${path} is public, no session required.`);
        }

        next();
    });
};
