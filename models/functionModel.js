const mongoose = require('mongoose');

const functionSchema = new mongoose.Schema({
    enterpriseId: {
        type: String,
    },
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\- ]+$/ui.test(value);
            }
        }
    }
});

const functionModel = new mongoose.model('function', functionSchema);
module.exports = functionModel;