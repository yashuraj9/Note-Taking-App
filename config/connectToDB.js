const mongoose = require("mongoose");

async function connectToDB() {
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to Database")
    } catch (err) {
        console.log(err);
    }
    
}

module.exports = connectToDB;