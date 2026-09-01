const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>Pure Node 서버</h1>
            <p>Node.js 기본 http 모듈만 사용합니다.</p>
            <ul>
                <li><a href='/hello?name=Jin'>/hello?name=Jin</a></li>
                <li><a href='/time'>/time</a></li>
            </ul>
        `);
        return;
        }
    if(url.pathname === '/hello'){
        const name = url.searchParams.get('name') || '익명';
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(`안녕하세요, ${name}님`);
        return;
    }

    if(url.pathname === '/time'){
        const data ={
            now : new Date().toISOString(),
            server: 'pure-node',
        };
        res.writeHead(200,{'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(data));
    }
      

});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});