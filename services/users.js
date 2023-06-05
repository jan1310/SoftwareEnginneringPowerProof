const e = require("express");

exports.getAll = async function (session, db) {
    const idUser = session.idUser;

    const contacts = await db.raw(
        `SELECT DISTINCT "idUser", "firstName", "lastName", MAX("sentAt") AS "maxSentAt", "idChat"
        FROM "User" U
                 LEFT JOIN "Chat" C on (U."idUser" = C."fromUser_id" AND C."toUser_id" = :idUser)
                                           OR (U."idUser" = C."toUser_id" AND C."fromUser_id" = :idUser)
                LEFT JOIN "Message" M on C."idChat" = M.chat_id
        WHERE "idUser" != :idUser
        GROUP BY "idUser", "fromUser_id", "toUser_id", "idChat"
        ORDER BY MAX("sentAt") DESC NULLS LAST, "firstName", "lastName"`, {
            idUser
        },
    );

    return contacts.rows;
};

exports.createUser = async function (username, firstname, lastname, password, db) {
    const created = await db('User')
        .insert({
            name: username,
            firstName: firstname,
            lastName: lastname,
            password: password,
        })
        .returning('*');

    return created[0];
}

exports.deleteUser = async function (idUser, db) {
    const subqeury = db('Chat').select('idChat').where('fromUser_id', idUser).orWhere('toUser_id', idUser);
    await db('Session').where('user_id', idUser).del().returning('*');
    await db('Message').whereIn('chat_id', subqeury).del().returning('*');
    await db('Chat').where('fromUser_id', idUser).orWhere('toUser_id', idUser).del().returning('*');
    const deleted = await db('User')
        .where({
            idUser
        })
        .del()
        .returning('*');

    if (deleted.length === 0) {
        throw new Error(constants.USER_NOT_FOUND);
    }
    return deleted[0];
}