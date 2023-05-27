const service = require('../services/users');
const security = require('../services/security');
const constants = require('../services/constants')

module.exports = async function (app) {
    app.get('/api/users', async function (req, res) {
        const data = await service.getAll(req.session, req.app.get('db'));

        res.json(data);
    });

    app.post('/api/user', async function (req, res) {
        try {
            const user = await service.createUser(req.body.username,
                req.body.firstname,
                req.body.lastname,
                security.hashPassword(req.body.password),
                req.app.get('db'))

                res.json(user)
        } catch (e) {
            if (e.code === '23505') {
                return res.status(404).json({ error: constants.USER_ALREADY_EXIST });
            } else {
                return res.status(500).json({ error: 'Unexpected' });
            }
        }
    });
};
