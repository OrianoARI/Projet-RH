const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nom d'entreprise obligatoire"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9\- 'À-ÖØ-öø-ÿ]+$/u.test(value); //renvoie un boolean
            },
            message: "Veuillez entrer un nom valide" //message si le nom ne respecte pas le validator
        }
    },
    siret: {
        type: String,
        required: [true, "SIRET obligatoire"],
        validate: {
            validator: function (value) {
                return /^[0-9]{14}$/u.test(value);
            },
            message: "Veuillez entrer un SIRET valide" //message si le SIRET ne respecte pas le validator

        }
    },
    mail: {
        type: String,
        required: [true, "Adresse mail obligatoire"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/u.test(value);
            },
            message: "Veuillez entrer une adresse mail valide" //message si le mail ne respecte pas le validator

        }
    },
    ceoName: {
        type: String,
        required: [true, "Nom du directeur obligatoire"],
        validate: function (value) {
            return /^[a-zA-Z\-]+$/u.test(value);
        }
    },
    password: {
        type: String,
        validate: function (value) {
            return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?!.*[<>&]).{8,}$/u.test(value);
        }
        //mettre un validator avec au moins 12 caractères, 1 carac spé, 1 nbr, 1 maj et en enlevant les caractères spéciaux dangereux
    }
});

const enterpriseModel = mongoose.model('enterprises', enterpriseSchema);
module.exports = enterpriseModel;