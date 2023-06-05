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

    app.delete('/api/user/:id', async function (req, res) {
        if(isNaN(parseInt(req.params.id))) {
            return res.status(400).json({ error: 'Invalid ID passed, expected a numeric ID' });
        }

        try {
            const result = await service.deleteUser(req.params.id, req.app.get('db'));
            return res.json(result);
        }catch (e) {
            if (e.message === constants.USER_NOT_FOUND) {
                return res.status(404).json({ error: constants.USER_NOT_FOUND });
            }
        }
    });
};
