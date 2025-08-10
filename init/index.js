const mongoose = require("mongoose");
const sampleData = require("../init/data.js");
const User = require("../models/users.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Pradeep"; // or use Atlas URI

main()
.then(()=>{
    console.log("Connected to MongoDB");    
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err)});
    async function main() {
    await mongoose.connect(MONGO_URL)
    };

   function data(){
    User.insertMany(sampleData)
    .then(() => {
        console.log("Sample data inserted successfully");
    })
    .catch((error) => { console.error("Error inserting sample data:", error);   
   });
};

data();


