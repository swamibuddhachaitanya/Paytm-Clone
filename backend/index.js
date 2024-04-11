//backend/index.js

const express = require("express");
var cors = require('cors')

const mainRouter = require("./routes/index");
const { connectToDb } = require("./db/db");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1",mainRouter);

connectToDb().then(()=>{
    app.listen(3000,()=>{
        console.log(" Backend Server Started.")
    })
})

