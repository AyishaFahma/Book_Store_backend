// multer is used to access the uploaded image files from req
// here req nte file object key nnanu uploaded contents ne kittullu
// so to create multer

const multer = require('multer')


// The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage( {

    destination: (req , file , callback)=>{
        //in which folder to store the files
        callback(null , './Imageuploads')
    },

    filename : (req , file , callback) =>{
        //frontendil name keyilanu aa imaginte name enthano ath ndavaa, but backendil ath originalname nna keyilanu veraa
        // so evide image-(aa filente name aanu veraa) in Imageuploads folder
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
        // pass an error statement why it accept
        return callback(new Error('Only accept png , jpg and jpeg files'))
    }
}




// to create configuration
const multerConfig = multer( {
    storage ,
    fileFilter
})


// to use the multer in path(add-book) we need to to export and use in routes.js
module.exports = multerConfig