var express = require("express");
var app = express();

app.get('/', (req,res) => {
    res.send("HELLO WORLD")
});


const PORT = process.env.PORT || 8000
app.listen(PORT);