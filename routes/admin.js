const { Router } = require('express');
const adminRouter = Router();
const express= require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { AdminModel } = require('../db');
const { adminMiddleware } = require('../middlewares/admin')
const { CourseModel } = require('../db')
adminRouter.use(express.json())



adminRouter.post("/signup", async function(req, res) {
    const { Email , Password , FirstName, LastName } = req.body
        const hashedPassword = await bcrypt.hash(Password,7)
        try{
            await AdminModel.create({
                Email,
                Password : hashedPassword,
                FirstName,
                LastName
            })
            res.json({
                message: "signup successfull"
            })
        } catch(e){
            res.json({
                message:"DB error"
            })
        }
})

adminRouter.post("/signin", async function(req, res) {
    const { Email, Password } = req.body
    
        const admin = await AdminModel.findOne({
            Email
        })
        if(!admin){
            return res.json({
                message: "Admin not found"
            })
            
        }
        const compare = await bcrypt.compare(Password, admin.Password)
    
        if(compare){
            const token = jwt.sign({ID : admin._id}, process.env.JWT_ADMIN_SECRET)
            res.json({
                token
            })
        }
        else{
            res.json({
                message:"Wrong Crendentials"
            })
        }
})


adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const CreatorId = req.AdminID
    const { title, description,ImageUrl,price } = req.body
    try{

        const course = await CourseModel.create({
            title,
            description,
            ImageUrl,
            price,
            CreatorId
        })
        
        res.json({
            message: "Course Created",
            courseID: course._id
        })
    }
    catch(e){
        res.json({
            message:"DB error"
        })
    }
    
    
})


adminRouter.put("/course",adminMiddleware, async function(req, res) {
    const CreatorId = req.AdminID
    const {title,description,ImageUrl,price,courseID} = req.body
    await CourseModel.updateOne({
        _id : courseID,
        CreatorId
    },{
        title,
        description,
        ImageUrl,
        price,
    })
    res.json({
        msg : "Updated",
        courseID,
    })
})

adminRouter.get("/courses/bulk", adminMiddleware, async function(req, res) {
    const CreatorId = req.AdminID
    const courses = await CourseModel.find({
        CreatorId
    })

    res.json({
        msg : "fetched",
        courses
    })
})

module.exports = {
    adminRouter
}