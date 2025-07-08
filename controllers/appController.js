

const applications = require("../model/applicationModel");


//to add new application

exports.addApplicationsController = async(req , res)=>{

    const {jobTitle ,fullname,qualification,email,phone,coverletter} = req.body

    const resume = req.file.filename

    console.log(jobTitle ,fullname,qualification,email,phone,coverletter,resume);

    try {

        const existingApplication = await applications.findOne( {jobTitle, email})

        if(existingApplication){
            res.status(406).json('Already Applied')
        }
        else{

            const newApplication = new applications({
                jobTitle,name:fullname, qualification,email,phone,coverLetter:coverletter,resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)

        }

        
    } catch (error) {
        res.status(500).json(error)
    }
    
}


//to get all application in admin side

exports.getAllApplicationController = async(req,res)=>{

    try {

        const allApplications = await applications.find()
        res.status(200).json(allApplications)
        
    } catch (error) {
        res.status(500).json(error)
    }
}
