// multer is used to access the uploaded image files from req
// so to create multer

const multer = require('multer')


// The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage( {

    destination: (req , file , callback)=>{
        callback(null , './Imageuploads')
    },

    filename : (req , file , callback) =>{
        callback(null , `Image - ${file.originalname}`)
    }
})


//fileFilter - function to control which files should be uploaded and which should be skipped.
// The function should call `cb- callback` with a boolean
// to indicate if the file should be accepted

const fileFilter = (req , file ,callback) =>{

    // in frontend the type key give the filetype but in backend mimetype give the typeof file

    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){

        //To accept the file pass `true`
        callback(null , true)
    }
    else{

        //To reject the file pass `false`
        callback(null , false)
        return callback(new Error('Only accept png , jpg and jpeg files'))
    }
}




// to give configuration
const multerConfig = multer( {
    storage ,
    fileFilter
})


// to use the multer in path we need to to export and use in routes.js
module.exports = multerConfig