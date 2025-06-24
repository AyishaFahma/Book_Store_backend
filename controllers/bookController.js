// to handle all book related req

// add a book

exports.addBookController = async (req , res) =>{
    //logic to store the book

    const {title,author,publisher,language, noofpages, isbn, imageUrl, category, price, dprice, abstract } = req.body

    console.log('this image',req.files);
    console.log(req.body);
    

    res.status(200).json('req received')

    






    

}