// router is a part b/w view and controller in mvc architecture. where router determine the path for where to resolve the request


// import express for creating router
const express = require('express')

//import that register function
const userController = require('./controllers/userController.js')

//import book
const bookController = require('./controllers/bookController.js')

//import job
const jobController = require('./controllers/jobController.js')

const applicationController = require('./controllers/appController.js')

//import router specific middleware
const jwt = require('./middleware/jwtMiddleware.js')

// import multer 
const multerConfig = require('./middleware/multerMiddleware.js')

//import pdf middleware
const pdfMulterConfig = require('./middleware/pdfMulterMiddleware.js')

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


//path to google login
routes.post('/google-login' , userController.googleLoginController)


// path to get all 4 newly added book in homepage
// here this homepage is for both admin and user
routes.get('/home-books' , bookController.homeBookController)


//path to get all jobs in both user and admin side
routes.get('/all-jobs' , jobController.getAllJobsController)


//path to edit the profile
routes.put('/edit-profile' , jwt , multerConfig.single('profile') , userController.updateProfileController)




//-----------------------------USER-------------------


//path to add book
// here we give the jwt router specific middleware coz we want to use the middleware in this perticular path for token verification
// and after that control goes to multer here uploadImages keyilanu files ullath athanu reqbodyil pass cheythittullath so aa key kodkka and max image is 3
routes.post('/add-book' , jwt , multerConfig.array('uploadImages' , 3) , bookController.addBookController)


//path to get all books - user
routes.get('/all-books-user' , jwt , bookController.getAllBookUserController)


//path to view a perticular book when viewbook button click
//id kodkkunna data ayirikkum controlleril verunnath
routes.get('/view-book/:id' , bookController.viewBookController)



//path to view book (sell status)
//path to get all user added book
routes.get('/all-user-added-books' , jwt , bookController.getAllUserAddedBooksController)


//path to get all user brought book
routes.get('/all-user-brought-books' , jwt , bookController.getAllUserBroughtBooksController)


//path to delete a book
routes.delete('/delete-book/:id' , bookController.deleteABookController)


//path to add a application
routes.post('/add-application',jwt, pdfMulterConfig.single("resume") ,applicationController.addApplicationsController)

//path to make payment
routes.put('/make-payment' , jwt, bookController.paymentController)


// --------------------ADMIN----------------------------


//path to get all books in admin side for approval or rejection
routes.get('/all-books' , bookController.getAllBookController)


//path to approve a book by admin button click
routes.put('/approve-Book/:id' , bookController.approveBookController)


//path to get all users in admin side
routes.get('/all-users' , userController.getAllUserController)


//path to add a new job
routes.post('/add-job' , jobController.addJobController)


// path to delete a job by admin
routes.delete('/delete-job/:id' , jobController.deleteJobController)


//path to get all application
routes.get('/all-application' , applicationController.getAllApplicationController)


//export this routes to connect with index.js
module.exports = routes