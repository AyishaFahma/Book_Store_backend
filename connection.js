//import mongoose for connecting server and database
const mongoose = require('mongoose')



// deployment phasil platformil ninnmum edkkanam
// development phasil .env file nnu edkkum
const connectionstring = process.env.DATABASE /* accessing the environment variable */

// to connect
mongoose.connect(connectionstring).then( () =>{ /* connect method returns a promise , here server and database are conncted successfully only in (then) method */
    console.log(`mongodb connected successfully`); /*positive response  */
    
}).catch( (err) =>{
    console.log(`mongodb connection failed due to : ${err}`); /* negative response  */
    
})