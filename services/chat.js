exports.createChat = async function (targetUser, session, db) {
    const idUser = session.idUser;

    const existingChat = await db('Chat')
        .where({ fromUser_id: targetUser, toUser_id: idUser })
        .orWhere({ fromUser_id: idUser, toUser_id: targetUser })
        .first('idChat');

    if (!existingChat) {
        const result = await db('Chat')
            .insert({
                fromUser_id: idUser,
                toUser_id: targetUser,
            })
            .returning('idChat');

        return { idChat: result[0].idChat };
    } else {
        return existingChat;
    }
};
