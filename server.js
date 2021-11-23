const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { MongoDriverError } = require("mongodb")
const port = 5000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

mongoose.connect('mongodb+srv://admin:admin@gymmemberapi.6ztao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })

const memberSchema = {
    name: String,
    gender: String,
    yearOfBirth: Number,
    memberId: String,
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

app.post("/", (req, res) => {
    let getBirth = req.body.yearOfBirth
    let stringBirth = getBirth.toString()
    let setId = req.body.name + stringBirth

    let newMember = new Member({
        name: req.body.name,
        gender: req.body.gender,
        yearOfBirth: req.body.yearOfBirth,
        memberId: setId,
        personalTraining: req.body.personalTraining,
        facility: {
            locker: req.body.locker,
            poor: req.body.poor,
            shower: req.body.shower
        }

    })
    if (newMember.name != null && newMember.name != 'undefine' && newMember.yearOfBirth != null && newMember.yearOfBirth != 'undefine') {
        newMember.save()
        res.redirect('/')
    } else console.log("missing")
})

app.delete('/list', (req, res) => {
    Member.deleteOne(
        { memberId: req.body.id }
    ).then(result => {
        if (result.deletedCount === 0) {
            return res.json('cannot delete')
        }
        res.json('Deleted')
    })
        .catch(error => console.error(error))
        console.log("id is here" + req.body.id)
})

app.put('/list', (req, res) => {
    Member.findOneAndUpdate(
        { memberId: req.body.id },
        {
            name: req.body.name,
            gender: req.body.gender,
            yearOfBirth: req.body.yearOfBirth,
            memberId: req.body.id,
            personalTraining: req.body.personalTraining,
            facility: {
                locker: req.body.locker,
                poor: req.body.poor,
                shower: req.body.shower
            }
        },
        { upsert: true }
    ).then(result => res.json('Success'))
        .catch(error => console.error(error))
console.log("id is here" + req.body.id)
})


app.listen(port, () => {
    console.log("server running")
})