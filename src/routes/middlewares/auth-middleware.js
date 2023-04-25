const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../../config');

module.exports = {
    verifyJwt: async (req, res, next) => {
        if(!req.headers.authorization || req.headers.authorization === '')
            return res.status(500).send('No token found');
        
        const token = req.headers.authorization.replace('Bearer ','');
        const isInvalid = jwt.verify(token, jwt_secret,   function (err, payload) {
            if (err) return err;
            else return null
        });

        if (isInvalid) return res.status(500).send(isInvalid);
        return next();
    }
}