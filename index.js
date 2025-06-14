// import express to create server

const express = require('express')

// import cors to connect the frontend with server
const cors = require('cors')

// import routes
const routes = require('./routes')

// create server
const bookstoreserver = express()

// {// here express() method is used to create server , in json server it uses create() method in the library, and in http server it uses createServer() method}

// use cors to connect with the frontend
bookstoreserver.use(cors())

//parse the json data
bookstoreserver.use(express.json())

// server
bookstoreserver.use(routes)

//port number setting
const PORT = 4000 || process.env.PORT

//listen to the port
bookstoreserver.listen(PORT , ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})


