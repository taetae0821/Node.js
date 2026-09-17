import express from "express";

const app = express();
const PORT = 5000;

function requestLogger(req,res,next){
    console.log(`[${req.method}] ${req.path}`);
    next();
}

function gido(req,res,next){
    console.log('떡상');
    next();
}

app.use(requestLogger);
app.use(gido);

app.get("/",(req,res)=>{
    res.send("테스트");
});

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
})