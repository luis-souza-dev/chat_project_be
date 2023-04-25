const { User, AccessToken } = require('../db/models');
const jsonwebtoken = require('jsonwebtoken');
const { jwt_secret } = require('../config');

module.exports = {

    login: async (req, res) => {
        if (!req.body.email) res.status(500).send('no email provided');
        if (!req.body.pwd) res.status(500).send('no pwd provided');

        const user = await User.findOne({
            where: {
                email: req.body.email,
                pwd: req.body.pwd,
            }
        });
        
        let token = jsonwebtoken.sign({
            userId: user.id,
            userEmail: user.email
        }, jwt_secret, { expiresIn: '30m' });

        token = await AccessToken.create({
            token,
        });

        await token.setUsers(user.id);

        res.send(token);
    }
}