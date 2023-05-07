module.exports = async function (app) {
    app.use(async function (req, res, next) {
        if (Math.random() > 0.5) {
            return res.status(400).json({ error: true });
        }

        next();
    });
};
