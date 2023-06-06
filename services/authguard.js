const enterpriseModel = require('../models/enterpriseModel');

let authguard = async (req, res, next) => {
    let enterprise = await enterpriseModel.findById(req.session.enterpriseId);
    if (enterprise) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = authguard;