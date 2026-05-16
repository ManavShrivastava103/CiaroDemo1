const mongoose = require("mongoose");
const colors = require("colors");

MONGO_DB_URL = process.env.MONGO_DB_URL ;

const connection_karde = async()=> {
    try {
        const connectiondb = await mongoose.connect(MONGO_DB_URL);
        console.log(colors.green("Database Connected Successfully !", connectiondb.connection.host, connectiondb.connection.name)) ;
    } catch (err) {
        console.log(colors.red("Error Connecting to Database. ", err.message));
        process.exit(1);
    }
}; 

module.exports = connection_karde ;