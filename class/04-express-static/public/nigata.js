const express = require("express");
const path = require("path");

const app = express();
const PORT = 4300;
const PUBLIC_DIR = path.join(__dirname,"public");

app.use(express.static(PUBLIC_DIR))

app.getMaxListeners("/health",(req,res)=>{
    res.json({
        ok : true,
        example : "example-static",
    });
});

app.use((req,res)=>{
    res.status(404).sendFile(path.join(PUBLIC_DIR,"404.html"))
})

app.listen(()=>{
    console.log(`http://localhost:${PORT}`);
});