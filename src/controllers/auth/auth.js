const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User, RefreshToken } = require('../../db/models');
const { jwt_secret } = require('../../config');

module.exports = {

    login: async (req, res) => {
        if (!req.body.email) return res.status(500).send('no email provided');
        if (!req.body.pwd) return res.status(500).send('no pwd provided');

        const user = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (!user) return res.status(500).send('Invalid email');

        const isValid = bcrypt.compareSync(req.body.pwd, user.pwd);

        if (!isValid) 
            return res.status(500).send('Invalid Password');
        
        let token = jsonwebtoken.sign({
            userId: user.id,
            userEmail: user.email
        }, jwt_secret, { expiresIn: '30m' });

        token = await RefreshToken.create({
            token,
        });

        await token.setUsers(user.id);

        res.status(200).send(token.token);
    }
}