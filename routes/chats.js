const chatService = require('../services/chat');
const constants = require('../services/constants');

module.exports = async function (router) {
    router.post('/api/chats', async function (req, res) {
        if (!req.body.targetUser) {
            return res
                .status(400)
                .json({ error: 'Expected a targetUser in the body' });
        }

        try {
        const result = await chatService.createChat(
            req.body.targetUser,
            req.session,
            req.app.get('db'),
        );

        res.json(result);
        } catch (e) {
            if (e.code === '23503') {
                return res
                    .status(404)
                    .json({ error: constants.USER_NOT_FOUND });
            } else{
                throw new Error('Undefined');
            }
        }
    });
   
    router.delete('/api/chats/deleteMessage/:messageId', async function (req, res) {
        const idMessage = req.params.messageId;

       console.log(idMessage);
        if (isNaN(parseInt(idMessage))) {
            return res
                .status(400)
                .json({ error: 'Invalid ID passed, expected a numeric ID' });
        }


        try {
            const result = await chatService.deleteMessages(
                idMessage,
                req.session,
                req.app.get('db'),
            );

            res.json(result);
        } catch (e) {
            if (e.message === constants.MESSAGE_NOT_FOUND) {
                return res
                    .status(404)
                    .json({ error: constants.MESSAGE_NOT_FOUND });
            }
        }
    });
 
    router.get('/api/chats/:id/messages', async function (req, res) {
        const idChat = req.params.id;

        if (isNaN(parseInt(idChat))) {
            return res
                .status(400)
                .json({ error: 'Invalid ID passed, expected a numeric ID' });
        }

        if (req.query.since && isNaN(parseInt(req.query.since))) {
            return res
                .status(400)
                .json({ error: 'Since is only valid with a proper number' });
        }

        try {
            const result = await chatService.getMessages(
                idChat,
                req.session,
                req.app.get('db'),
                req.query.since,
            );

            res.json(result);
        } catch (e) {
            if (e.message === constants.CHAT_NOT_FOUND) {
                return res
                    .status(404)
                    .json({ error: constants.CHAT_NOT_FOUND });
            }
        }
    });
    

    router.post('/api/chats/:id/messages', async function (req, res) {
        const idChat = req.params.id;

        if (isNaN(parseInt(idChat))) {
            return res
                .status(400)
                .json({ error: 'Invalid ID passed, expected a numeric ID' });
        }

        if (!req.body.content) {
            return res
                .status(400)
                .json({ error: 'Expected a content in the body' });
        }

        try {
            const result = await chatService.createMessage(
                idChat,
                req.body.content,
                req.session,
                req.app.get('db'),
            );

            res.json(result);
        } catch (e) {
            if (e.message === constants.CHAT_NOT_FOUND) {
                return res
                    .status(404)
                    .json({ error: constants.CHAT_NOT_FOUND });
            }
        }
    });
};
