// module imports
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()
const jwt = require("jsonwebtoken")
const coki = require('cookie-parser');

// model imports
const {Consultant, Session, Booking} = require('./models/consultationModels')
const {Volunteer, Role, Department} = require('./models/volunteerModels')
const {Blog} = require('./models/miscModels')
const {User} = require('./models/userModels')

// other imports
const utils = require('./utils')

// connect Mongo
const DB_URI = process.env.PROD_DB
mongoose.connect(DB_URI).then(res => console.log("::: mongoDB connected"))

// init app
const app = express()
app.listen(3000, ()=>{
    console.log("::: Server running on localhost:3000")
})

// middlewares
app.use(express.json())
app.use(cors())
app.use(coki());


const SECRET = "pathway-plus-2022"




// consultant routes
// later refactor with express.Router()

app.get('/consultant/all', async (req,res)=>{
    let {page, limit, name, country} = req.query

    let results;

    if (!page && !limit && !name && !country){
        results = await Consultant.find()
    }else{
        results = await utils.consultant_filter(Consultant, {page:parseInt(page),limit:parseInt(limit),name,country})
    
        if (!results){
            results = await Consultant.find()
        }
    }

    res.json(results)
})

// app.get('/consultant/paginate', async (req,res)=>{
//     let {page=1, limit=10} = req.query
//     let results = await utils.paginate_filter(Consultant, parseInt(page), parseInt(limit))

//     res.json(results)
// })

// app.get('/consultant/filter', async(req,res)=>{
//     let {name, country} = req.query
//     let queryObj = {name: { $regex: name, $options: "i"}}
//     if (country) queryObj["country"]={ $regex: country, $options: "i"};
//     console.log(queryObj)
//     let results = await Consultant.find(queryObj).exec()
//     res.json(results)
// })


app.get('/consultant/:id', async (req,res)=>{
    let consultantDetails;
    try{
        consultantDetails = await Consultant.where("_id").equals(req.params.id)
    } catch(err) {
        consultantDetails = null
        res.status(404)
    }
    res.json(consultantDetails)
})

app.get('/consultant/:id/sessions', async (req,res)=>{
    let consultantSessions;
    try{
        consultantSessions = await Session.where("consultant").equals(req.params.id)
    } catch(err) {
        consultantSessions = {
            "error" : "consultant not found"
        }
        res.status(404)
    }
    res.json(consultantSessions)
})


// sample reqest body
// {
//     "name" : "Rebecca",
//     "email" : "rb@gmail.com",
//     "profile" : "https://profile.com/x.png",
//     "country" : "Japan",
//     "university" : "Arasaka University",
//     "major" : "Cybernetics",
//     "year" : "Sophomore",
//     "introduction" : "Some Boring blah blah blah.",
//     "type" : "Public"
// }
app.post('/consultant/create', async (req,res)=>{
    let createdConsultant = await Consultant.create(req.body)
    res.json(createdConsultant)
}) 

app.delete('/consultant/delete/:id', async (req,res)=>{
    let deletedConsultant = await Consultant.deleteOne({_id:req.params.id})
    res.json(deletedConsultant)
})

app.patch('/consultant/update/:id', async (req,res)=>{
    let updatedConsultant = await Consultant.findOne({_id:req.params.id})
    for (const key in req.body){
        if(key != "_id"){
            updatedConsultant[key] = req.body[key]
        }
    }
    updatedConsultant.save()
    res.json(updatedConsultant)
})
















// session routes
// later refactor with express.Router()

app.get('/session/all', async (req,res)=>{
    let allSessions = await Session.find()
    res.json(allSessions)
})


// sample reqest body
// {
//     "date" : "2006-01-01T17:30:00.000Z",
//     "startTime" : ["4:00", "PM"],
//     "endTime" : ["4:30", "PM"],
//     "consultant" : "634309adb5afa7ed5784a7c2"
// }
app.post('/session/create', async (req,res)=>{
    let createdSession = await Session.create(req.body)
    res.json(createdSession)
})

app.delete('/session/delete/:id', async (req,res)=>{
    let deletedSession = await Session.deleteOne({_id:req.params.id})
    res.json(deletedSession)
})






// Booking routes
// later refactor
// app.post("/booking/crate", async(req,res)=>{
//     let result;
//     let booking = await Booking.findOne({session:req.body["session"]})
//     if (booking){
//         result = {
//             error: "already booked"
//         }
//     } else {
//         let newBooking = await Booking.create(req.body)
//         result = newBooking
//     }
//     res.json(result)

// })

app.post("/booking/crate", async(req,res)=>{
    let result;
    let bd = req.body
    try{
        let session = await Session.findOne({_id:bd.session})
        let booking = await Booking.findOne({session:bd.session})
        if (session.weekly){
            if (booking){
                bd["date"] = session["date"]
            } else {
                bd["date"] = session["date"]
            }
            let createdBooking = await Booking.create(bd)
            result = createdBooking
        } else {
            if (booking) {
                result = {error:"already booked"}
            } else {
                bd["date"] = session["date"]
                let createdBooking = await Booking.create(bd)
                result = createdBooking
            }
        }
    } catch(err) {
        result = {
            error : "no session found"
        }
    }

    res.json(result)
    

})
























// volunteer routes
// later refactor with express.Router()

app.get('/volunteer/all', async (req,res)=>{
    let allVols = await Volunteer.find().populate("role","-_id -__v").populate("department","-_id -__v")
    res.json(allVols)
})


// smaple request body
// {
//     "name" : "Denji",
//     "role" : "Visual Designer",
//     "department" : "Creative",
//     "duration" : "3 months"
// }

app.post('/volunteer/create', async (req,res)=>{
    let dep = await Department.exists({ name : `${req.body["department"]}` })
    let rol = await Role.exists({ name : `${req.body["role"]}` })

    let resultDep;
    if (dep == null){
        resultDep = await Department.create({name:`${req.body["department"]}`})
    }else{
        resultDep = await Department.findOne({name:`${req.body["department"]}`})
    }
    req.body["department"] = resultDep["_id"]
    
    let resultRol;
    if (rol == null){
        resultRol = await Role.create({name:`${req.body["role"]}`})
    }else{
        resultRol = await Role.findOne({name:`${req.body["role"]}`})
    }
    req.body["role"] = resultRol["_id"]
    
    let createdVol = await Volunteer.create(req.body)
    res.json(createdVol)
})


app.delete('/volunteer/delete/:id', async (req,res)=>{
    let deletedVol = await Volunteer.deleteOne({_id:req.params.id})
    res.json(deletedVol)
})




















// blog routes
// later refactor

app.get('/blog/all', async (req, res) => {
    let allBlogs = await Blog.find()
    res.json(allBlogs)
})

app.get('/blog/:id', async (req,res)=>{
    let blogDetails;
    try{
        blogDetails = await Blog.where("_id").equals(req.params.id)
    } catch(err) {
        blogDetails = null
        res.status(404)
    }
    res.json(blogDetails)
})

// sample reqest body
// {
//     "cover" : "https://profile.com/x.png",
//     "title" : "Some Title.",
//     "body" : "Lorem ipsum sed ikip,,,,",
//     "categories" : ["IT", "Art", "Business"],
// }
app.post('/blog/create', async (req,res)=>{
    let createdBlog = await Blog.create(req.body)
    res.json(createdBlog)
})
app.delete('/blog/delete/:id', async (req,res)=>{
    let deletedBlog = await Blog.deleteOne({_id:req.params.id})
    res.json(deletedBlog)
})













// user routes
app.get('/user/all', async (req, res) => {
    let allUsers = await User.find()
    res.json(allUsers)
})

app.get('/user/:id', async (req, res) => {
    let userDetails;
    try{
        userDetails = await User.where("_id").equals(req.params.id)
    } catch(err) {
        userDetails = null
        res.status(404)
    }
    res.json(userDetails)
})



// sample reqest body
// {
//     "username" : "Makima",
//     "email" : "makima@gmail.com",
//     "profile" : "https://profile.com/q.png",
//     "phone" : "09787955651",
//     "dob" : "2001-01-01T17:30:00.000Z",
//     "city" : "Arasaka",
//     "password" : "qwerty",
// }
// app.post("/auth/register", async (req,res) => {
//     let result;
//     let emailExist = await User.exists({ email : req.body["email"] })
//     if(emailExist){
//         result = {
//             error : "email already exists"
//         }
//     } else {
//         try {
//             let createdUser = await User.create(req.body)
//             const access_token = jwt.sign(createdUser, SECRET, {expireIn:"24h"})
//             res.cookie("jwt_access", access_token, { httpOnly: true })
//             result = createdUser
//         } catch(err) {
//             result = {
//                 error : err.message
//             }
//         }
//     }
//     res.json(result)
// })


// sample reqest body
// {
//     "email" : "makima@gmail.com",
//     "password" : "qwerty",
// }
app.post("/auth/login", async (req,res)=>{
    let result;
    let user = await User.findOne({email:req.body["email"]})
    if(user){
        let psw_correct = await user.checkPassword(req.body["password"])
        if(psw_correct){
            const access_token = jwt.sign(user, SECRET, {expireIn:"24h"})
            res.cookie("jwt_access", access_token, { httpOnly: true })
            result = user
        } else {
            request = {
                error : "password incorrect"
            }
        }
    } else {
        request = {
            error : "password incorrect"
        }
    }
    res.json(result)
})


app.get("/auth/logout", (req,res)=>{
    res.clearCookie("jwt_access");
    res.json({
        message : "user logged out"
    })
})

