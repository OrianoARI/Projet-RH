const bcrypt = require('bcrypt');
const enterpriseRouter = require('express').Router();
const enterpriseModel = require('../models/enterpriseModel');
const employeeModel = require('../models/employeeModel');
const authguard = require('../services/authguard');
const upload = require('../services/multer');
const fs = require('fs');


//afficher la page d'inscription

enterpriseRouter.get('/', async (req, res) => {
    try {
        res.render('pages/registration.twig');
    } catch (error) {
        res.send(error);
    }
});


//créer une entreprise

enterpriseRouter.post('/subscribe', async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        let enterprise = new enterpriseModel(req.body);// création d'une entreprise via remplissage formulaire d'inscription
        await enterprise.save();
        res.redirect('/');
    } catch (error) {
        res.send(error);
    }
});


//route de login
enterpriseRouter.post('/login', async (req, res) => {
    try {
        let enterprise = await enterpriseModel.findOne({ mail: req.body.mail });
        if (enterprise) {
            let match = await bcrypt.compare(req.body.password, enterprise.password);
            req.session.enterpriseId = enterprise._id;
            if (match) {
                res.redirect("/dashboard");
            } else {
                res.status(400);
                res.redirect("/");
            }
        } else {
            res.status(400);
            res.redirect("/");
        }
    } catch (error) {
        console.log("boloss");
        res.send(error);
    }
});



//récupérer tous les employés pour les afficher sur la page dashboard
enterpriseRouter.get('/dashboard', authguard, async (req, res) => {
    try {
        let enterpriseId = req.session.enterpriseId;
        console.log(enterpriseId);
        let employee = await employeeModel.find({ enterpriseId: enterpriseId })

        res.render("pages/dashboard.twig", {
            employees: employee,
        });
    } catch (error) {
        res.send(error);
    }
});

//créer un employé

enterpriseRouter.post('/addEmployee', upload.single("photo"), async (req, res) => {
    try {
        if (req.file.filename) {
            req.body.photo = req.file.filename;
            console.log(req.body.photo);
        }
        req.body.enterpriseId = req.session.enterpriseId;
        let employee = new employeeModel(req.body);
        await employee.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//supprimer un employé

enterpriseRouter.get('/deleteEmployee/:id', async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ _id: req.params.id });
        if (employee.photo) {
            let imagePath = `./assets/uploads/${employee.photo}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                console.log('merde');
                throw error;
            }
        }
        await employeeModel.deleteOne({ _id: req.params.id });
        res.redirect("/dashboard");
    } catch (error) {
        console.log('remerde');
        res.send(error);
    }
});


//route de déconnection

enterpriseRouter.get('/logout', (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            // Rediriger vers la page d'accueil ou toute autre page après la déconnexion
            res.redirect('/');
        }
    });
});





module.exports = enterpriseRouter;