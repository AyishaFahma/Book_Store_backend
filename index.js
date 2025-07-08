//import dotenv module to load environment variable
require('dotenv').config() // config method is to load .env file contents into process.env


// import express to create server
const express = require('express')


// import cors to connect the frontend with server
const cors = require('cors')


// import routes
const routes = require('./routes')


// import or invoke connection file
// server um aayi database connect cheyyanu in index.js coz this is the only file that is running
require('./connection')




 


// create server
const bookstoreserver = express()

// {// here express() method is used to create server , in json server it uses create() method in the library, and in http server it uses createServer() method}

// use cors to connect with the frontend
bookstoreserver.use(cors())

//parse the json data , coz axios aanu use cheyyunnath axios aytomatically json ayitt data ne convert cheythittundavm athine aanu parse cheythath
bookstoreserver.use(express.json())

// server
bookstoreserver.use(routes)


//nammal upload cheytha images eppo Imageuploads folder ilanu ullath so athine frontendil kittenam athinu vendi
// express.static() method is used to export the folder from server 
bookstoreserver.use('/imgUpload' , express.static('./Imageuploads'))

//pdf uploads
bookstoreserver.use('/pdfUploads' , express.static('./pdfUploads'))


//port number setting
const PORT = 4000 || process.env.PORT

//listen to the port
bookstoreserver.listen(PORT , ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})


