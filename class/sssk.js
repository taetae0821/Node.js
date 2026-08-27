const http = require('http');

const server = http.createServer((req,res)=>{
    res.end('Hello World 50');
})

server.listen(3000);