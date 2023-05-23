const { USER_NOT_FOUND } = require('./constants');
const security = require('./security');
const config = require('../config');

exports.getSession = async function (token, db) {
    if (!token) return null;

    const session = await db('Session')
        .innerJoin('User', 'User.idUser', '=', 'Session.user_id')
        .select(['idUser', 'firstName', 'lastName', 'expiresAt', 'token'])
        .where({ token })
        .first();

    if (session && session.expiresAt <= Date.now()) {
        await exports.destroySession(token, db);
        return null;
    }

    return session || null;
};

exports.createSession = async function (name, password, db) {
    const user = await db('User').where({ name }).first();

    if (!user) throw new Error(USER_NOT_FOUND);

    const matchesPassword = security.compareHash(password, user.password);

    if (!matchesPassword) throw new Error(USER_NOT_FOUND);

    const token = security.generateSessionToken();

    await db('Session').insert({
        token,
        user_id: user.idUser,
        expiresAt: Date.now() + config.tokenTTL,
    });

    return {
        user,
        token,
    };
};

exports.destroySession = async function (token, db) {
    await db('Session').where({ token }).delete();
};

exports.prolongSession = async function (token, db) {
    await db('Session')
        .update({ expiresAt: Date.now() + config.tokenTTL })
        .where({ token });
};
