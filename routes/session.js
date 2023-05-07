module.exports = async function (router) {
    router.get('/api/session', async function (req, res) {
        res.json(req.session);
    });

    router.post('/api/session', async function (req, res) {
        res.json({ ok: true });
    });
};
