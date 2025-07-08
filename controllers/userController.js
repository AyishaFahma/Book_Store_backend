// whenever in frontend , /register nnu paranja pathil ninnum oru request veraneel aa request ne resolve cheyyan ulla logic aanu evide kodkkande, so athine export cheyyendi verm use cheyyan

const users = require("../model/userModel");

const jwt = require('jsonwebtoken');


// ee function ne aanu routes il call cheyyendath


//logic to register
exports.registerController = async(req , res)=>{
    // logic 
    // username, email,password are get from request frontend while registering
    const {username , password , email } = req.body
    console.log(username , password , email);
    // res.status(200).json('req recieved') /* postman vech test cheyyanu req res proper ayi work cheyyunnundonnu */

    /* now data kittindu so eni logic implement cheyyanam , ee data already db yil ndoo check cheyyanam ellel store cheyyanam , athinu vendi nammak structure create cheyyanam so db yumayi communicate cheyyan data ne store cheyyenda structure paranj kodkkan modal venm in mvc arch so that in model folder*/


    // logic implement cheyyumbo runtime errors veran chance ndu so handle cheyyan try catch il kodkka

    try {

        // already user existing anoo check cheyyanam so here email is the unique data in users collection in atlas db
        const existingUser = await users.findOne( {email})

        // findOne return either that document if it present or null

        if(existingUser){
            res.status(406).json('User Already exist')
        }
        else{
            // add this newuser into db
            // here the coming req and db yil store cheyyenda keyum same ayathondu aanu onnum mathram kodthe . incase eppo req bodyile data name aneel username: name kodkkanam
            // and profile & bio kodkkanda coz value default ayitt set cheythittundu

            const newUser = new users( {
                username ,
                email ,
                password
            })
            // to save in mongodb
            await newUser.save()
            res.status(200).json(newUser)

        }
        
    } catch (error) {

        res.status(500).json(error)
        
    }   
}

// login logic

exports.loginController = async ( req, res ) => {
    // here only email and password is taken from user
    const {email , password} = req.body
    console.log(email , password);

    try {
        // db yil users collectionil email nnu paranja keyil user thanna reqil ulla email value ndo check cheyyanu , here key and value are same
        const existingUser = await users.findOne( {email})

        if( existingUser){

            // email exist aaneel oru document aanu theraa so existing user nnu paranja documentinte(object) password keyil user kodtha password same anoo check cheyyum
            if(existingUser.password == password){
                // sign(secret data, secret key) is used to create token
                const token = jwt.sign( {userMail:existingUser.email} , process.env.JWTSECRETKEY)
                // object ayitt frontendilekk send cheyyanu evide key and value same aanu , so onnu kodthal mathi
                res.status(200).json( {existingUser , token})
            }
            // if password not match
            else{
                res.status(403).json('Invalid credentials')
            }

        }
        else{
            res.status(406).json('User Doesnot Exist, Please Register')
        }
        
    } catch (error) {
        res.status(500).json(error)
        
    }
    
}


//update the profile
exports.updateProfileController = async(req, res)=>{

    const userMail = req.payload
    console.log(userMail);


    const {username , password , bio , profile} = req.body
    console.log(username , password , bio , profile);



    //if user update the profile photo it can access from only req files coz of it active multer . otherwise it store previous value in profile

    pro = req.file ? req.file.filename : profile
    console.log(pro);



    try {

        const updatedprofile = await users.findOneAndUpdate({email:userMail} , {
            username,
            email:userMail,
            password,
            bio,
            profile:pro

        } , {new:true})

        res.status(200).json(updatedprofile)
        
    } catch (error) {
        res.status(500).json(error)
    }    
    
}


// ------------------ADMIN----------------------------


// get all users

exports.getAllUserController = async(req,res)=>{

    // to remove admin from the usercollection when get using find method

    const query = {
        email:{
            $ne:'admin@gmail.com'
        }
    }

    try {

        const allUsers = await users.find(query)
        res.status(200).json(allUsers)

        
    } catch (error) {
        res.status(500).json(error)
        
    }

}