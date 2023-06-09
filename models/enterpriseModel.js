const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nom d'entreprise requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9\- 'À-ÖØ-öø-ÿ]+$/u.test(value);
            }
        }
    },
    siret: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[0-9]{14}$/u.test(value);
            }
        }
    },
    mail: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/u.test(value);
            }
        }
    },
    ceoName: {
        type: String,
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