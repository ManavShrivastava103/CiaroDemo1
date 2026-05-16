const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const color = require("colors");
dotenv.config();

const connection_karde = require("./config/dbConnect"); 
const seed_counters = require("./services/counterSeeder");

connection_karde();

const PORT = process.env.PORT || 5311

const app = express()

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("This Is Organisation User-Projects Management System Server!!!")
});

seed_counters();

// this should be defined at the last after the routes.
app.use(require("./middleware/errorHandler"));

app.listen(PORT, ()=> {
    console.log(color.blue("Server Running On Port", PORT));
});