const express = require('express');

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Express 서버</h1>
        <p>Express를 사용합니다.</p>
        <ul>
            <li><a href='/hello?name=Jin'>/hello?name=Jin</a></li>
            <li><a href='/time'>/time</a></li>
        </ul>
    `);
});

app.get('/hello', (req, res) => {
    const name = req.query.name || '익명';
    res.send(`안녕하세요, ${name}님`);
});

app.get('/time', (req, res) => {
    const data = {
        now: new Date().toISOString(),
        server: 'express'
    };

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});