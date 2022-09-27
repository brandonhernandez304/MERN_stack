// D E P E N D E N C I E S //
require("dotenv").config();
//pull port from .env, give defeault value of 4000
const { PORT = 4000 } = process.env;
//import express
const express = require("express");
//create application object
const app = express();
// import mongoose
const mongoose = require("mongoose")
// define MONGODB
const MONGODB_URL = process.env.MONGODB_URL
// import middleware
const cors = require('cors')
const morgan = require("morgan")
// D A T A B A S E    C O N N E C T I O N //
//Establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
})
// Connection Events
mongoose.connection
.on("open", ()=> console.log("Mongoose connected"))
.on("close", ()=> console.log("Disconnected from mongoose"))
.on("error", (error)=> console.log(error))
// M O D E L S //
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

// M I D D L E W A R E //
app.use(cors()); //to prevent cors errors, open access to all origins
app.use(morgan("dev")); //logging
app.use(express.json());//parse json bodies

// R O U T E S //

app.get('/', (req,res)=>{
    res.send("hello world")
});

// I N D E X //

// People Routes //

//People Index
app.get("/people", async(req,res)=>{
    try{
        res.json(await People.find({})) //do this and if not
    } catch (error){
        res.status(400).json(error) //catch the error 
    }
})
//People New

//People Delete
app.delete("/people/:id", async(req,res)=>{
    try{
        //send all people
        res.json(await People.findByIdAndDelete(req.params.id))
    } catch(error){
        //send error
        res.status(400).json(error)
    }
})
//People Update
app.put("/people/:id", async(req,res)=>{
    try{
        //send all people
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new:true})
        )
    } catch(error){
        res.status(400).json(error)
    }
})
//People Create
app.post("/people", async (req,res)=>{
    try{
        res.json(await People.create(req.body))
    } catch (error){
        res.status(400).json(error)
    }
})

// L I S T E N E R //
app.listen(PORT, () => console.log(`listening to the PORT ${PORT}`))