// router is a part b/w view and controller in mvc architecture. where router determine the path for where to resolve the request


// import express for creating router
const express = require('express')

//import that register function
const userController = require('./controllers/userController.js')

//import book
const bookController = require('./controllers/bookController.js')

//import middleware
const jwt = require('./middleware/jwtMiddleware.js')

// import multer 
const multerConfig = require('./middleware/multerMiddleware.js')

// there is a class called router , that class is gives the path, so inorder to access the class we need instance/ obj
const routes = new express.Router()


// path to register a user
// in register , it is a post request  . 
// eeth pathilanu resolve cheyyendath ennathanu first argument , here /register pathilanu
// second argument is function which define how the request has to be resolved (how to resolve the request by logic)

routes.post('/register' , userController.registerController) 
// ie. frontendil ninnu /register pathil ninnu request veraaneel ath registerController nnu paranja function nte logic ne base cheyth resolve cheyyan parayanu

// path to login
routes.post('/login' , userController.loginController)



//-----------------------------USER-------------------


//path to add book
// here we give the jwt middleware coz we want to use the middleware in this perticular path
routes.post('/add-book' , jwt , multerConfig.array('uploadImages' , 3) , bookController.addBookController)



//export this routes to connect with index.js
module.exports = routes
