const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { MongoDriverError } = require("mongodb")
const port = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

mongoose.connect('mongodb+srv://admin:admin@gymmemberapi.6ztao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })

const memberSchema = {
    name: String,
    gender: String,
    yearOfBirth: Number,
    personalTraining: Boolean,
    facility: {
        locker: Boolean,
        poor: Boolean,
        shower: Boolean
    }
}

const Member = mongoose.model("members", memberSchema)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/list", (req, res) => {
    Member.find({}, (err, members) => {
        res.render('index', {
            memberList: members

        })
    })

})

//how could i make this working..?
app.post("/list",), (req, res)=> {
    
    var option = {id: Member.id}

    Member.findByIdAndUpdate(option, update, {
        
        name: req.body.name,
        gender: req.body.gender,
        yearOfBirth: req.body.yearOfBirth,
        personalTraining: req.body.personalTraining,
        facility: {
            locker: req.body.locker,
            poor: req.body.poor,
            shower: req.body.shower
        }
    })
    Member.save()
    res.render('/list')
}



// app.get("/search", (req, res) => {
//     let getId = req.body.id

//     Member.
//         res.render('search', {

//         })
// })

// app.get("/search?getName=getName", (req, res) => {
//     let getName = req.body.name

//     Member.findById(getName, (err, members) => {
//         if (err) {
//         }
//         res.render('/search', {
//             memberList: members
//         })

//     })
// })

// app.get("/search?getName=getName", (req, res) => {
//     let getName = req.body.name

//     Member.findById(getName, (err, members) => {
//         if (err) {

//         }
//         res.render('/search?getName=getName', {
//             memberList: members
//     })

//     })
// })

app.post("/", (req, res) => {

    let newMember = new Member({
        name: req.body.name,
        gender: req.body.gender,
        yearOfBirth: req.body.yearOfBirth,
        personalTraining: req.body.personalTraining,
        facility: {
            locker: req.body.locker,
            poor: req.body.poor,
            shower: req.body.shower
        }

    })
    if (newMember.name != null && newMember.name != 'undefine' && newMember.yearOfBirth != null && newMember.yearOfBirth != 'undefine') {
        newMember.save()
    } else console.log("missing")

})

app.listen(port, () => {
    console.log("server running")
})