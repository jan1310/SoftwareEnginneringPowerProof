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
        ORDER BY MAX("sentAt") DESC NULLS LAST, "firstName", "lastName"`,
        { idUser },
    );

    return contacts.rows;
};
