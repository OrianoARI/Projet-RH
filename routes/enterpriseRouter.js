const bcrypt = require('bcrypt');
const enterpriseRouter = require('express').Router();
const enterpriseModel = require('../models/enterpriseModel');
const employeeModel = require('../models/employeeModel');
const functionModel = require('../models/functionModel');
const authguard = require('../services/authguard');
const upload = require('../services/multer');
const fs = require('fs');



//afficher la page d'inscription

enterpriseRouter.get('/', async (req, res) => {
    try {
        res.render('pages/registration.twig', {
            enterpriseError: ""
        });
    } catch (error) {
        res.send(error);
        response.status(404);
    }
});


//créer une entreprise

enterpriseRouter.post('/subscribe', async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        let enterprises = await enterpriseModel.findOne({ siret: req.body.siret });
        if (enterprises) {
            console.log(enterprises);
            let siretError = "Une entreprise avec ce numéro de SIRET existe déjà"
            res.status(400).render("pages/registration.twig", {
                siretError: { siretError }
            });
        } else {
            let enterprise = new enterpriseModel(req.body);// création d'une entreprise via remplissage formulaire d'inscription
            await enterprise.save();
            res.redirect('/');
        }
    } catch (error) {

        let registerError = "Les données saisies sont incorrectes"
        res.status(400).render("pages/registration.twig", {
            enterpriseError: { registerError }
        });
    }
});


//route de login
enterpriseRouter.post('/login', async (req, res) => {
    try {
        let enterprise = await enterpriseModel.findOne({ mail: req.body.mail });
        if (enterprise) {
            let match = await bcrypt.compare(req.body.password, enterprise.password);
            req.session.enterpriseId = enterprise._id;
            req.session.enterpriseName = enterprise.name;
            if (match) {
                res.redirect("/dashboard");
            } else {
                let loginError = "Erreur de mot de passe"
                res.status(400).render("pages/registration.twig", {
                    enterpriseError: { loginError }
                });
            }
        } else {
            let noEnterpriseError = "Ce mail n'est associé à aucune entreprise";
            res.status(400).render("pages/registration.twig", {
                enterpriseError: { noEnterpriseError }
            });
        }
    } catch (error) {
        res.send(error);
    }
});


//créer une nouvelle fonction

enterpriseRouter.post('/addFunction', authguard, async (req, res) => {
    try {
        req.body.enterpriseId = req.session.enterpriseId;
        let newFunction = new functionModel(req.body);// création d'une nouvelle fonction via remplissage de l'input nouvelle fonction
        await newFunction.save();
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send("Erreur de validation des données")
    }
});


//rechercher les employés pour les afficher sur la page dashboard
enterpriseRouter.get('/dashboard', authguard, async (req, res) => {
    try {
        let name = req.query.name;
        let employeeFunction = req.query.function;
        let enterpriseId = req.session.enterpriseId;
        if (name) {
            const searchTerm = name.toLowerCase();
            let employeeFunctions = await functionModel.find({ enterpriseId: enterpriseId });
            let employees = await employeeModel.find({ enterpriseId: enterpriseId });
            // Filtrer les employés dont le nom correspond au terme de recherche insensible à la casse
            employees = employees.filter(employee => employee.name.toLowerCase() === searchTerm);

            res.render("pages/dashboard.twig", {
                employees: employees,
                employeeFunctions: employeeFunctions

            });
        } else if (employeeFunction) {

            let employees = await employeeModel.find({ "function": employeeFunction, enterpriseId: enterpriseId });
            let employeeFunctions = await functionModel.find({ enterpriseId: enterpriseId });
            res.render("pages/dashboard.twig", {
                employees: employees,
                employeeFunctions: employeeFunctions
            });

        } else {
            let enterpriseId = req.session.enterpriseId;
            let employee = await employeeModel.find({ enterpriseId: enterpriseId })
            let employeeFunctions = await functionModel.find({ enterpriseId: enterpriseId });
            res.render("pages/dashboard.twig", {
                employees: employee,
                employeeFunctions: employeeFunctions
            });
        }
    } catch (error) {
        res.send(error);
    }
});


//créer un employé

enterpriseRouter.post('/addEmployee', authguard, upload.single("photo"), async (req, res) => {
    try {
        if (req.file.filename) {
            req.body.photo = req.file.filename;
        }

        req.body.enterpriseId = req.session.enterpriseId;
        let employeeFunction = await functionModel.findOne({ name: req.body.function })
        if (!employeeFunction) {
            req.body.enterpriseId = req.session.enterpriseId;
            let newFunction = new functionModel({
                enterpriseId: req.session.enterpriseId,
                name: req.body.function
            });
            await newFunction.save();
            let employee = new employeeModel(req.body);
            await employee.save();
            res.redirect('/dashboard');
        } else {
            let employee = new employeeModel(req.body);
            await employee.save();
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//supprimer un employé

enterpriseRouter.get('/deleteEmployee/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ _id: req.params.id });
        if (employee.photo) {
            let imagePath = `./assets/uploads/${employee.photo}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                throw error;
            }
        }
        await employeeModel.deleteOne({ _id: req.params.id });
        res.redirect("/dashboard");
    } catch (error) {
        res.send(error);
    }
});


//récupération d'un employé pour l'afficher dans la modale update

enterpriseRouter.get('/updateEmployee/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ _id: req.params.id })
        res.render("pages/dashboard.twig", {
            employee: employee
        });
    } catch (error) {

        res.send(error);
    }
});

//blâmer un employé

enterpriseRouter.get('/blameEmployee/:id', authguard, async (req, res) => {
    try {
        let employeeToblame = await employeeModel.findOne({ _id: req.params.id });
        let blame = employeeToblame.blame;
        blame++;
        req.body.blame = blame;
        let employee = await employeeModel.updateOne({ _id: req.params.id }, req.body);
        req.body.blame = blame;
        if (req.body.blame >= 3) {
            let employeeId = req.params.id
            return res.redirect(`/deleteEmployee/${employeeId}`)
        }
        res.redirect("/dashboard"); // code: 'ERR_HTTP_HEADERS_SENT' => si res.redirect pas dans else ou si pas de return, affiche cette erreur car il envoie deux reponses en même temps

    } catch (error) {
        console.log('error');
        res.send(error);
    }
});

//Modifier un employé

enterpriseRouter.post('/updateEmployee/:id', authguard, upload.single('photo'), async (req, res) => {
    try {
        if (req.file) {
            let delPhoto = await employeeModel.findOne({ _id: req.params.id });
            let photoPath = `./assets/uploads/${delPhoto.photo}`;
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
            req.body.photo = req.file.filename;
        }
        let employeeFunction = await functionModel.findOne({ name: req.body.function })
        if (!employeeFunction) {
            req.body.enterpriseId = req.session.enterpriseId;
            let newFunction = new functionModel({
                enterpriseId: req.session.enterpriseId,
                name: req.body.function
            });
            await newFunction.save();
            let employee = await employeeModel.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/dashboard');
        } else {
            let employee = await employeeModel.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/dashboard');
        }
    }
    catch (error) {
        console.log('error');
        res.send(error);
    }
});




//route de déconnection

enterpriseRouter.get('/logout', authguard, (req, res) => {
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