const config = require('./config');

const express = require('express');
const app = express();
const knex = require('knex');

async function start() {
    // Initialize db connection
    const db = knex(config.databaseConnection);

    app.set('db', db);

    const middlewares = [
        //
        require('./middlewares/01_session'),
        (app) => app.use(express.static('public')),
        (app) => app.use(express.json()),
    ];

    const routes = [
        //
        require('./routes/chats'),
        require('./routes/session'),
    ];

    for (const file of middlewares.concat(routes)) {
        await file(app);
    }

    app.listen(config.port, function () {
        console.log(`App started on port ${config.port}`);
    });
}

start();
