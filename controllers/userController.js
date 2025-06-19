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
    const {email , password} = req.body
    console.log(email , password);

    try {

        const existingUser = await users.findOne( {email})

        if( existingUser){


            if(existingUser.password == password){
                const token = jwt.sign( {userMail:existingUser.email} , process.env.JWTSECRETKEY)
                res.status(200).json( {existingUser , token})
            }
            else{
                res.status(403).json('Invalid credentials')
            }
        }
        else{
            res.status(406).json('User Does not Exist, Please Register')
        }
        
    } catch (error) {
        res.status(500).json(error)
        
    }
    
}