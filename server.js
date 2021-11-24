
//decraer and import express to connect firebase server
const mongoose = require('mongoose')
const db = mongoose.connection;
db.once('error', () => {
    console.log(err);
});
db.once('open', () => {
    console.log("DB connnected")
});
const express = require("express")
const app = express()
const path = require('path')
//make the app use the bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', 'views')
const port = 5000
//for style.css to call static 
app.use(express.static(path.join(__dirname, 'public')))

//set the gymmember schema
const memberSchema = mongoose.Schema({
    name: String,
    gender: String,
    yearOfBirth: Number,
    personalTraining: Boolean,
    facility: {
        locker: Boolean,
        poor: Boolean,
        shower: Boolean
    }
})
const Member = mongoose.model('member', memberSchema)

//get list from firebase to list in :localhost:port
//call index.ejs
app.get("/", (req, res) => {
    Member.find({}, (err, member) => {
        if (err) return res.json(err)
        res.render('index', {
            member: member
        })
    })
})

//call create.ejs in: localhost:port/create
app.get('/create', (req, res) => {
    res.render('create')
})

//send data to firebase in :localhost:port/create
app.post('/create', (req, res) => {
    Member.create(req.body, (err, member) => {
        if (err) return res.json(err);
        res.redirect('/');
    })
})

//find data from firebase with unique id in: localhost:port/unique id
app.get('/:id', (req, res) => {
    Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.render('read', { member: member });
    })
})

//delete data from firebase with unique id: localhost:port/delete/unique id
app.get('/delete/:id', (req, res) => {
    Member.deleteOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.redirect('/');
    });
});

//call update.ejs in :localhost:port/update/unique id
app.get('/update/:id', (req, res) => {
    Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.render('update', { member: member });
    });
});

//save data to firebase with unique id: localhost:port/update/unique id
app.post('/update/:id', (req, res) => {
    Member.updateOne(
        { _id: req.params.id },
        {
            $set: {
                name: req.body.name,
                gender: req.body.gender,
                yearOfBirth: req.body.yearOfBirth,
                personalTraining: req.body.personalTraining,
                facility: {
                    locker: req.body.locker,
                    poor: req.body.poor,
                    shower: req.body.shower
                }
            }
        },
        (err, member) => {
            if (err) return res.json(err);
            //when it is done call index.ejs in : localhost:port/
            res.redirect('/');
        });
});

//start server
app.listen(port, () => {
    mongoose.connect('mongodb+srv://admin:admin@gymmemberapi.6ztao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })
})