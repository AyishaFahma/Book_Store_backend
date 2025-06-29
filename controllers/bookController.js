// to handle all book related req

//import books model schema
const books = require('../model/bookModel')

// to add a book

exports.addBookController = async (req , res) =>{
    //logic to store the book
    // logic - ee oru book already ee oru user add cheythittundo check cheyynam . if not added then add the book in db

    //logic nu munne ee user logined user anoo check cheyyanam athinu vendi frontendil ninnu reqheader token ne send cheyyunnundu, so logic cheyyunnathinte munne verify cheyyanam token ne thats why we use middleware

    const {title,author,publisher,language, noofpages, isbn, imageUrl, category, price, dprice, abstract } = req.body
    // here we need to access the uploaded images so to handle that we use multer middleware

    console.log(req.files);
    console.log(req.body);
    //to get which user
    console.log(req.payload);
    
    


    //logic

    try {

        // to check wheather the book is already added in db so check using find by isbn or title and also ee book add cheythath araanu ariyanam
        //so evide req.payload aayi aa usermail send cheyyunnundu (login cheytha user) . and model il kodthittulla keyil ee payload ndo check cheyya . so that ee user ee book add cheythittundo check cheyyanu

        const existingBook = await books.findOne( {title , userMail:req.payload } )

        if(existingBook) {
            // already book present
            res.status(401).json('Book Already exist')
        }
        else{
            const newBook = new books( {

                title,author,publisher,language, noofpages, isbn, imageUrl, category, price, dprice, abstract , uploadImages:req.files , userMail : req.payload

            })

            await newBook.save()
            res.status(200).json(newBook)


        }
    
    } catch (error) {
        res.status(500).json(error)   
    }   
}


// to display latest added 4 books in home page
// get home book from db

exports.homeBookController = async(req , res) => {

    try {
        // to get the last 4 items or newly added books in db (in db newly added in last)
        // here -1 is given for reverse order(last one) descending order for id coz id is increment

        const allHomeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(allHomeBooks)
        
    } catch (error) {
        res.status(500).json(error)
        
    }

}



// controller to get all books in userside in Book page 

exports.getAllBookUserController = async(req,res) => {

    // to get the search item from input
    const {search} = req.query
    console.log(search);


    // only other user add cheytha book mathre oru user nu kanan pattu

    const userMail = req.payload
    


    try {

        const query = {
            title: {
                $regex:search , $options:"i"
            },
            userMail : {
                $ne:userMail
            }
        }

        const allBooksUser = await books.find(query)
        res.status(200).json(allBooksUser)
        
    } catch (error) {

        res.status(500).json(error)
        
    }
}


// get a perticular book when viewbook button click by user
// here we need id for uniqly find each book

exports.viewBookController = async(req, res) => {

    //id use cheythanu data ne fetch cheyyunnath, and id will be send as a parameter. so here request nte params nnu aanu id ne access cheyyendath
    const {id} = req.params
    console.log(id);
    
    try {

        const specificBook = await books.findOne( {_id:id})
        res.status(200).json(specificBook)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
}


// get all user added book(user sell cheyyan vendi add cheytha book)

exports.getAllUserAddedBooksController = async(req, res) => {

    const userMail = req.payload

    try {

        const allUserBooks = await books.find( {userMail})
        res.status(200).json(allUserBooks)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
}



// get all books brought by user

exports.getAllUserBroughtBooksController = async(req, res) => {

    const userMail = req.payload

    try {

        const allUserBroughtBooks = await books.find( {BroughtBy:userMail})
        res.status(200).json(allUserBroughtBooks)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
}