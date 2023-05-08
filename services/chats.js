exports.createChat = async function (targetUser_id, session, db) {
    const chatExists = await db('Chat')
        .where({ fromUser_id: targetUser_id, toUser_id: session.idUser })
        .orWhere({ toUser_id: targetUser_id, fromUser_id: session.idUser })
        .first('idChat');

    if (chatExists) return chatExists;

    const created = await db('Chat')
        .insert({
            toUser_id: targetUser_id,
            fromUser_id: session.idUser,
        })
        .returning('idChat');

    return created[0];
};
