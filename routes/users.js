const service = require('../services/users');

module.exports = async function (app) {
    app.get('/api/users', async function (req, res) {
        const data = await service.getAll(req.session, req.app.get('db'));

        res.json(data);
    });
};
