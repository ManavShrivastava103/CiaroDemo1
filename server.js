const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
dotenv.config();

const connection_karde = require("./config/dbConnect");

connection_karde();

const PORT = process.env.PORT || 5311

const app = express()

app.get("/", (req, res) => {
    res.send("This Is Organisation User-Projects Management System Server!!!")
});

app.listen(PORT, ()=> {
    console.log(color.blue("Server Running On Port", PORT));
});