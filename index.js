const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const messages = [
    {sender: 1, message: 'Hi', timestamp: '2023-05-03 11:18'},
    {sender: 2, message: 'Moin', timestamp: '2023-05-03 11:18'},
    {sender: 1, message: 'Was geht?', timestamp: '2023-05-03 11:18'},
    {sender: 2, message: 'Alles', timestamp: '2023-05-03 11:18'},
    {sender: 2, message: 'Pls respond', timestamp: '2023-05-03 11:18'},
];

app.get('/api/', async function(req, res) {
    res.json(messages);
});

app.post('/api/', async function(req, res) {
    messages.push(req.body);
    res.json({success: true});
});

app.listen(3001, function() {
    console.log("App started on port 3001");
})