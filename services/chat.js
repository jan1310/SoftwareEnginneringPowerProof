const constants = require('./constants');

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
exports.deleteMessages = async function (message_id,session, db){
    const idUser = session.idUser;

    const targetChat = await db('Message')
    .where({ user_id: idUser }).where({idMessage: message_id})
    .first('idMessage');

    if (!targetChat) {
        throw new Error(constants.MESSAGE_NOT_FOUND);
    }

const message = db('Message')
.where({idMessage: message_id})
.del();
const result = await message;
console.log(result);
return result;
}

exports.getMessages = async function (idChat, session, db, since = null) {
    const idUser = session.idUser;

    const targetChat = await db('Chat')
        .where({ idChat })
        .where((qb) =>
            qb.where({ fromUser_id: idUser }).orWhere({ toUser_id: idUser }),
        )
        .first('idChat');

    if (!targetChat) {
        throw new Error(constants.CHAT_NOT_FOUND);
    }

    const messageQuery = db('Message')
        .where({ chat_id: idChat })
        .select('sentAt', 'content', 'user_id', 'idMessage')
        .orderBy('sentAt', 'asc');

    if (since) {
        messageQuery.where('sentAt', '>', since);
    }

    const messages = await messageQuery;

    return messages;
};

exports.createMessage = async function (idChat, content, session, db) {
    const idUser = session.idUser;

    const targetChat = await db('Chat')
        .where({ idChat })
        .where((qb) =>
            qb.where({ fromUser_id: idUser }).orWhere({ toUser_id: idUser }),
        )
        .first('idChat');

    if (!targetChat) {
        throw new Error(constants.CHAT_NOT_FOUND);
    }

    const created = await db('Message')
        .insert({
            chat_id: idChat,
            user_id: idUser,
            content,
            sentAt: Date.now(),
        })
        .returning('*');

    return created[0];
};
