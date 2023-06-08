const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const enterpriseRouter = require('./routes/enterpriseRouter');


require("dotenv").config();


const app = express();

app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(function (req, res, next) {//récupère la cession utilisateur si connecté sur toutes les pages
    res.locals.enterprise = req.session
    next()
})


app.use(enterpriseRouter);
// app.use(userRouter);


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Connecté au port: ${process.env.PORT}`);
    }
});

try {
    mongoose.connect(process.env.DB_URI)
    console.log("Connecté à la base de données");
} catch (error) {
    console.log(error);
}