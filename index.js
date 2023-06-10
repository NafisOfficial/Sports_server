const express = require("express");
const cors = require('cors');
const app = express();


app.use(cors())

const port = 5000;


app.get('/',(req,res)=>{
    res.send("Server is fine!!!");
})

app.listen(port,()=>{
    console.log(`server is running successfully on port ${port}`);
})