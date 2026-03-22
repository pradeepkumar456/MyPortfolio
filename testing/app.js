const express = require("express");     
const app = express();  
const Port = 8080;


app.get("/", (req, res) => {
    res.send("Hello World! Adi!");
});


app.listen(Port, () => {    
    console.log(`Server is running on :${Port}`);
});