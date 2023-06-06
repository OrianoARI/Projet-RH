const mongoose = require('mongoose');
const enterpriseModel = require('./enterpriseModel');

const employeeSchema = new mongoose.Schema({
    enterpriseId: {
        type: String,
    },
    name: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\-]+$/.test(value);
            }
        }
    },
    function: {
        type: String,
    },
    blame: {
        type: Number,
    },
    photo: {
        type: String,
    }
});

const employeeModel = mongoose.model('Employee', employeeSchema);
module.exports = employeeModel;