// to handle all book related req

//import books model schema
const books = require('../model/bookModel')

//import stripe
const stripe = require('stripe')(process.env.STRIPESECRETKEY)

// to add a book

exports.addBookController = async (req, res) => {
    //logic to store the book
    // logic - ee oru book already ee oru user add cheythittundo check cheyynam . if not added then add the book in db

    //logic nu munne ee user logined user anoo check cheyyanam athinu vendi frontendil ninnu reqheader token ne send cheyyunnundu, so logic cheyyunnathinte munne verify cheyyanam token ne thats why we use middleware

    const { title, author, publisher, language, noofpages, isbn, imageUrl, category, price, dprice, abstract } = req.body
    // here we need to access the uploaded images so to handle that we use multer middleware

    console.log(req.files);
    console.log(req.body);
    //to get which user
    console.log(req.payload);




    //logic

    try {

        // to check wheather the book is already added in db so check using find by isbn or title and also ee book add cheythath araanu ariyanam
        //so evide req.payload aayi aa usermail send cheyyunnundu (login cheytha user) . and model il kodthittulla keyil ee payload ndo check cheyya . so that ee user ee book add cheythittundo check cheyyanu

        const existingBook = await books.findOne({ title, userMail: req.payload })

        if (existingBook) {
            // already book present
            res.status(401).json('Book Already exist')
        }
        else {
            const newBook = new books({

                title, author, publisher, language, noofpages, isbn, imageUrl, category, price, dprice, abstract, uploadImages: req.files, userMail: req.payload

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

exports.homeBookController = async (req, res) => {

    try {
        // to get the last 4 items or newly added books in db (in db newly added in last)
        // here -1 is given for reverse order(last one) descending order for id coz id is increment

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)

    } catch (error) {
        res.status(500).json(error)

    }

}



// controller to get all books in userside in Book page 

exports.getAllBookUserController = async (req, res) => {

    // to get the search item from input
    // search key aanu all api yil kodthath so athil aanu data kitta
    const { search } = req.query
    console.log(search);


    // only other user add cheytha book mathre oru user nu kanan pattu

    const userMail = req.payload



    try {

        const query = {
            // regex - search key and title match anoo check cheyyum. option for casesensitivity nullify
            title: {
                $regex: search, $options: "i"
            },
            // oru user add cheythath ayalkk kanan padilla
            userMail: {
                $ne: userMail
            },
            status: {
                $ne: 'sold'
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

exports.viewBookController = async (req, res) => {

    //id use cheythanu data ne fetch cheyyunnath, and id will be send as a parameter. so here request nte params nnu aanu id ne access cheyyendath
    const { id } = req.params
    console.log(id);

    try {

        const specificBook = await books.findOne({ _id: id })
        res.status(200).json(specificBook)

    } catch (error) {
        res.status(500).json(error)

    }
}


// get all user added book(user sell cheyyan vendi add cheytha book)

exports.getAllUserAddedBooksController = async (req, res) => {

    const userMail = req.payload

    try {

        const allUserBooks = await books.find({ userMail })
        res.status(200).json(allUserBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}



// get all books brought by user

exports.getAllUserBroughtBooksController = async (req, res) => {

    const userMail = req.payload

    try {

        const allUserBroughtBooks = await books.find({ BroughtBy: userMail })
        res.status(200).json(allUserBroughtBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}


// to delete a perticular book sell by the user , here user is deleting the book
exports.deleteABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);


    try {

        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('Deleted')

    } catch (error) {
        res.status(500).json(error)

    }

}


//make payment Controller
exports.paymentController = async (req, res) => {

    const email = req.payload
    console.log(email);

    const { bookDetails } = req.body
    console.log(bookDetails);

    try {

        const existingBook = await books.findByIdAndUpdate({ _id: bookDetails._id }, {


            title: bookDetails.title,
            author: bookDetails.author,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            noofpages: bookDetails.noofpages,
            isbn: bookDetails.isbn,
            imageUrl: bookDetails.imageUrl,
            category: bookDetails.category,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            uploadImages: bookDetails.uploadImages,
            userMail: bookDetails.userMail,
            status: 'sold',
            BroughtBy: email


        }, { new: true })

        console.log(existingBook);

        //line item 
        const line_item = [{
            price_data: {
                // currency in dollars
                currency: 'usd',
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imageUrl],
                    metadata: {

                        title: bookDetails.title,
                        author: bookDetails.author,
                        publisher: bookDetails.publisher,
                        language: bookDetails.language,
                        noofpages: bookDetails.noofpages,
                        isbn: bookDetails.isbn,
                        imageUrl: bookDetails.imageUrl,
                        category: bookDetails.category,
                        price: `${bookDetails.price}`,
                        dprice: `${bookDetails.dprice}`,
                        abstract: bookDetails.abstract.slice(0,20),
                        //uploadImages: bookDetails.uploadImages,
                        userMail: bookDetails.userMail,
                        status: 'sold',
                        BroughtBy: email
                        
                    }
                },
                //this unit amout is in cent so convert it by 100
                unit_amount:Math.round(bookDetails.dprice*100)
            },
            quantity:1

        }]

        //create a checkout session 
        const session = await stripe.checkout.sessions.create({

            //payment mode or type
            payment_method_types: ['card'],
            //details of the product that we are purchasing
            line_items: line_item,
            mode: 'payment',
            //payment success ayaal move cheyyenda path
            success_url: 'http://localhost:5173/payment-success',
            //cancel path
            cancel_url: 'http://localhost:5173/payment-error'
        })

        console.log(session);
        res.status(200).json({sessionId:session.id})
        



    } catch (error) {
        res.status(500).json(error)
    }


}



// ------------------ADMIN-----------------


// to get all books
exports.getAllBookController = async (req, res) => {
    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)

    } catch (error) {

        res.status(500).json(error)

    }
}


// approve book by admin
exports.approveBookController = async (req, res) => {

    const { id } = req.params
    console.log(id);

    try {

        const existingBook = await books.findOne({ _id: id })


        //update
        const UpdatedBook = await books.findByIdAndUpdate({ _id: id }, {

            title: existingBook.title,
            author: existingBook.author,
            publisher: existingBook.publisher,
            language: existingBook.language,
            noofpages: existingBook.noofpages,
            isbn: existingBook.isbn,
            imageUrl: existingBook.imageUrl,
            category: existingBook.category,
            price: existingBook.price,
            dprice: existingBook.dprice,
            abstract: existingBook.abstract,
            uploadImages: existingBook.uploadImages,
            userMail: existingBook.userMail,
            status: 'Approved',
            BroughtBy: existingBook.BroughtBy

        }, { new: true })
        res.status(200).json(UpdatedBook)

    } catch (error) {
        res.status(500).json(error)

    }
}



