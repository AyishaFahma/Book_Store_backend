//  router specific middleware is used for token verification when a user is add a book in frontend , here only logined user can add a book. so here we want to check the user has token to ensure user logined 

const routes = require("../routes");

const jwt = require('jsonwebtoken')



const jwtMiddleware = (req , res , next) =>{

    // to check wheather the controll is inside this middleware
    console.log("inside jwt middle ware");

    // inorder to access the token from requestHeader we assign headers key for reqHeader in axios configuration or we can use split(' ')[1]
    const token = req.headers["authorization"].slice(7)

    // console.log(token);
    // next()

    try {

        const jwtResponse = jwt.verify(token,process.env.JWTSECRETKEY)
        console.log(jwtResponse);
        next()
        
        
    } catch (error) {
        res.status(401).json('Authorization failed', error)
        
    }

    
}

module.exports = jwtMiddleware

// router specific middleware is imported in routes. where as applicationspecific in index.js



