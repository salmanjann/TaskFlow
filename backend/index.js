require("dotenv").config();
const {connectToMongoDB} = require("./database");
const express = require('express')
const cors = require('cors')
const path = require('path');



const app = express();
app.use(cors());

//use json middleware
app.use(express.json())

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const router = require('./routes')
// forward /api requests to router
// using 'use' middleware
app.use("/api",router);

const port = process.env.PORT || 5000;

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () =>{
        console.log(`Server is listening on port ${port}`)
    })
}

startServer();
