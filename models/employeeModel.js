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
        type: String
    },
    blame: {
        type: Number,
        validate: {
            validator: function (value) {
                return /^[0-2]$/u.test(value);
            }
        }
    },
    photo: {
        type: String,
    }
});

const employeeModel = mongoose.model('Employee', employeeSchema);
module.exports = employeeModel;