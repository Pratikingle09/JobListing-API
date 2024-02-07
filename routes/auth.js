const express = require('express')
const router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/register', async(req,res)=>{
    try {
        const {name,email,mobile,password} = req.body;

        if(!name || !email || !mobile || !password)
        {
          return res.status(400).json({
                erroeMessage:'Bad Request',
            })
        }

       const isExistingUser = await User.findOne({email:email})
       if(isExistingUser)
       {
        return res.status(409).json({message:"User already exist"})
       }
       
       const isExistingMobile = await User.findOne({mobile:mobile})
       if(isExistingMobile)
       {
        return res.status(409).json({message:"mobile number already exist"}) // return is used to stop the exicution of further code
       }

       const hashedPassword = await bcrypt.hash(password,10);
     const userData = await User.create({
        name,
        email,
        mobile,
        password:hashedPassword,
       })

    // another way to add a data in a db
    
    // const newUser = new User({
    //     name,
    //     email,
    //     mobile,
    //     password:hashedPassword,
    // })

    // newUser.save().then(()=>{
    //     res.status(200).json({message:"user registered successfully"})
    // }).catch((err)=>{
    //     console.log(err)
    // })


    const token = await jwt.sign({userId:userData._id},process.env.JWT_SECRET,)
       res.status(200).json({message:"user register successfully",token:token,name:name})

        
    } catch (error) {
        console.log(error)
    }



        // valid check
    // error handling
    // check if user already exist
    // write into the database
            // create model / schema
    // joi and yup to validate the incoming data

})

router.post('/login',async (req,res)=>{
try {
    const {email,password}=req.body;
    if(!email || !password)
    {
      return res.status(400).json({
            erroeMessage:'Bad Request,Invalid Credential',
        })
    }
    const userDetails = await User.findOne({email})
    if(!userDetails){
        res.status(401).json({erroeMessage:"Invalid Credentisls" , success:false})
    }
    
    const passwordCheck = await bcrypt.compare(password,userDetails.password)
    if(!passwordCheck)
    {
        res.status(401).json({erroeMessage:"Invalid Credentisls",success:false})
    }

    const token = await jwt.sign({userId:userDetails._id},process.env.JWT_SECRET,)
    res.status(200).json({message:"user logged in successfully",token:token,name:userDetails.name,success:true})

} catch (error) {
 console.log(error)   
}
})

module.exports=router;