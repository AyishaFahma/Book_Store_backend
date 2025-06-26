//  router specific middleware is used for token verification when a user is add a book in frontend in a perticular path only, here only logined user can add a book. so here we want to check the user has token to ensure user logined 
// here jsonweb token use cheythittanu token generate cheythath 

const routes = require("../routes");

const jwt = require('jsonwebtoken')



const jwtMiddleware = (req , res , next) =>{

    // to check wheather the controll is inside this middleware
    console.log("inside jwt middle ware");

    // inorder to access the token from requestHeader we assign headers key for reqHeader in axios configuration. instead os slice() or we can use split(' ')[1]
    // headers nnu paranjath axios nte key aanu athinte value reqHeader aanu addbook api yil frontendil kodthath athil authorization keyilanu token ullath `Bearer token` = here ulla authorization alla frontendil ullath avide Authorization aanu, why bcoz nammal req.header console cheythal athile authorization keyilanu token ullath athil ninnum Bearer remove akkan aanu slice use cheythath 
    const token = req.headers["authorization"].slice(7)

    // console.log(token);
    // next()

    try {
        // verify token using verify() inside (secret data, secret key)
        const jwtResponse = jwt.verify(token,process.env.JWTSECRETKEY)
        console.log(jwtResponse); /* here , we get {userMail: 'ken@gmai.com' , iat : 175266...(this value is issuedTime in milliseconds)} */

        // here, nammukk ee jwtresponsil varunna userMail venam bookne add chyunna user ne kittan vendi in bookcontroller find() logic part
        req.payload = jwtResponse.userMail
        next()
        
        
    } catch (error) {
        res.status(401).json('Authorization failed', error)
        
    }

    
}

module.exports = jwtMiddleware

// router specific middleware is imported in routes. where as applicationspecific in index.js



