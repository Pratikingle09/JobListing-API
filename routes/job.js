const express = require("express");
const router = express.Router();
const job = require("../model/job");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/create" ,verifyJwt,async (req, res) => {
  try {
    const { companyName,
      logo,
      position,
      salary,
      type,
      remoteOrOffice,
      jobLocation,
      jobDescription,
      about,
      skills,
      info, } = req.body;
      if (!companyName || !logo || !position || !salary || !type || !remoteOrOffice || !jobLocation || !jobDescription || !about || !skills || !info ){
      return res.status(400).json({
        erroeMessage: "Bad Request",
        success:false
      });
    }

    await job.create({
      companyName,
      logo,
      position,
      salary,
      type,
      remoteOrOffice,
      jobLocation,
      jobDescription,
      about,
      skills,
      info,
      // refUserId: req.body.userId,
    });
    res.status(200).json({ erroeMessage: "new job created successfully",success:true });
  } catch (error) {
    console.log(error);
  }
});

// update or edit

router.put("/edit/:jobid", verifyJwt, async (req, res) => {
  // put is used to update the entry
  try {
    const { companyName,
      logo,
      position,
      salary,
      type,
      remoteOrOffice,
      jobLocation,
      jobDescription,
      about,
      skills,
      info, } = req.body;
    const jobId = req.params.jobid;
    if (!companyName || !logo || !position || !salary || !type || !remoteOrOffice || !jobLocation || !jobDescription || !about || !skills || !info  || !jobId) {
      return res.status(400).json({
        erroeMessage: "Bad Request",
      });
    }

    await job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          logo,
          position,
          salary,
          type,
          remoteOrOffice,
          jobLocation,
          jobDescription,
          about,
          skills,
          info,
        },
      }
    );

    res.status(200).json({ message: "Job details updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/job-description/:jobid", async (req, res) => {
  // get is used to only read the enfo altho we can ues it to pass the info through query parameter but it is not a good practice
  try {
    const jobId = req.params.jobid;
    if (!jobId) {
      return res.status(400).json({
        erroeMessage: "Bad Request",
      });
    }

    const jobDetails = await job.findById(jobId); // when we have to return all the field present in the object

    //  const jobDetails = await job.findById(jobId,{
    //     title:1,       // when 1 is given it will return only that field
    //  })

    res.status(200).json({ jobDetails });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all", async (req, res) => {
  // to get all the job on the database
  try {
    // const jobList = await job.find({}); // when we have to return all the field present in the database
    // to filter the data on specific variable
    //   const jobList = await job.find({title:"softwre Engineer"}); // it will return all the objects which have the same title
    //   const jobList = await job.find({},
    //  {
    //     companyName:1, // "this is called as projection"
    //  }); // it will return all the objects by the variable which is made true (1)
    const position = req.query.position || "";
    const skills = req.query.skills;
    const filterSkills = skills?.split(","); // as we got the value in the form of string we have converted it in array by using split
// the ? behind skills is called optional chaning it is simmiler to turnary operator but it will work only for arrays and objects
    let filter = {};
    if (filterSkills) {
      filter = { skills: { $in: [...filterSkills] } };
    }

    const jobList = await job.find({
      position: { $regex: position, $options: "i" }, // it will serch the word which given to $regex case-insetively as $options:"i"
      ...filter, // skills: { $in: [...skills] },   i can't use like this as its a array if it is empty it will not search
    });

    res.status(200).json({ jobList });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
