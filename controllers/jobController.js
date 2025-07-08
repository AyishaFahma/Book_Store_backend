
// add job

const jobs = require("../model/jobModel");



exports.addJobController = async(req, res)=>{
    const { title, location, jType, salary, qualification, experience, description } = req.body

    console.log(title, location, jType, salary, qualification, experience, description);


    try {

        const existingJob = await jobs.findOne( {title,location})

        if(existingJob){
            res.status(401).json('Job Already Added')
        }
        else{
            const newJob = new jobs( {
                title,location,jType,salary,qualification,experience,description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
        
    } catch (error) {
        res.status(500).json(error)
        
    }
    
}


// get all jobs
exports.getAllJobsController = async(req, res)=>{
    
    const {search} = req.query
    console.log(search);
    
    try {

        const allJobs = await jobs.find( {
            title:{
                $regex: search , $options : "i"
            }
        })
        res.status(200).json(allJobs)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

// to delete a job
exports.deleteJobController = async(req, res)=>{

    const {id} = req.params
    console.log(id);
    

    try {

        await jobs.findByIdAndDelete( {_id:id} )
        res.status(200).json('Deleted')
        
    } catch (error) {
        res.status(500).json(error)
    }
}