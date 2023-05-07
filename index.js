const config = require('./config');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

async function start() {
    const middlewares = [
        //
        require('./middlewares/01_session'),
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
