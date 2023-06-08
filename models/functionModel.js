const mongoose = require('mongoose');

const functionSchema = new mongoose.Schema({
    enterpriseId: {
        type: String,
    },
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const functionModel = new mongoose.model('function', functionSchema);
module.exports = functionModel;