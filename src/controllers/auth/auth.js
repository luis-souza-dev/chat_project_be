const jwt = require('jsonwebtoken');
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
        console.log('a', jwt_secret);
        console.log('b', process.env.JWT_SECRET);
        let accessToken = jwt.sign({
            userId: user.id,
            userEmail: user.email
        }, process.env.JWT_SECRET, { expiresIn: '30m' });

        let refreshToken = jwt.sign({
            userId: user.id,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const _refreshToken = await user.getRefreshToken();
        if (!_refreshToken) {
            const token = await RefreshToken.create({
                token: refreshToken
            });
            await token.setUser(user);
            await user.setRefreshToken(token);
        }

        res.status(200).send({
            accessToken,
            refreshToken,
        });
    },

    refresh: async (req, res) => {
        console.log('a', req.body);
        if(!req.body.token) return res.status(500).send('Missing token');
        const token = jwt.verify(req.body.token, jwt_secret,   function (err, payload) {
            if (err) return false;
            else return payload
        });
        if(!token) return res.status(500).send('Invalid Token');
        const user = await User.findOne({
            where: {
                id: token.userId,
            }
        });
        console.log('a, user', user)
        if (!user) return res.status(500).send('User not found');
        
        const userRefreshToken = await user.getRefreshToken();
        if (req.body.token !== userRefreshToken.token) return res.status(401).send('Token missmatch');

        const error = jwt.verify(userRefreshToken.token, jwt_secret, (err) => {
            if (err) return res.status(401).send('Invalid Token');
            else return null
        });
        console.log('userRefreshToken',userRefreshToken);
        if (!error) {
            const accessToken = jwt.sign({
                userId: user.id,
                userEmail: user.email
            }, jwt_secret, { expiresIn: '30m' });

            const refreshToken = jwt.sign({
                userId: user.id,
            }, jwt_secret, { expiresIn: '1d' });

            await userRefreshToken.update({
                token: refreshToken
            });
            return res.status(200).send({
                accessToken,
                refreshToken
            })
        }
    }
}