module.exports = async function (router) {
    router.post('/api/chats', async function (req, res) {
        res.json({ ok: true });
    });

    router.get('/api/chats/:id/messages', async function (req, res) {
        res.json({ ok: true });
    });

    router.post('/api/chats/:id/messages', async function (req, res) {
        res.json({ ok: true });
    });

    router.delete('/api/chats/:id/messages', async function (req, res) {
        res.json({ ok: true });
    });
};
