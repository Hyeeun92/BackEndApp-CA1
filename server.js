const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin@gymmemberapi.6ztao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })
const db = mongoose.connection;

db.once('error', () => {
    console.log(err);
});
db.once('open', () => {
    console.log("DB connnected")
});

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

const express = require("express")
const app = express()
const path = require('path')

const bodyParser = require("body-parser");
const { render } = require('ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', 'views')
const port = 5000

app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
    Member.find({}, (err, member) => {
        if (err) return res.json(err)
        res.render('index', {
            member: member
        })
    })
})

app.get('/create', (req, res) => {
    res.render('create')
})


app.post('/create', (req, res) => {
    Member.create(req.body, (err, member) => {
        if (err) return res.json(err);
        res.redirect('/');
    })
})

app.get('/:id', (req, res) => {
    Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.render('read', { member: member });
    })
})

app.get('/delete/:id', (req, res) => {
    Member.deleteOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.redirect('/');
    });
});

app.get('/update/:id', (req, res) => {
    Member.findOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.json(err);
        res.render('update', { member: member });
    });
});

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
            res.redirect('/');
        });
});


app.listen(port, () => {
    console.log("server running")
})