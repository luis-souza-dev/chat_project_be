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
        
        let accessToken = jsonwebtoken.sign({
            userId: user.id,
            userEmail: user.email
        }, jwt_secret, { expiresIn: '30m' });

        let refreshToken = jsonwebtoken.sign({
            userId: user.id,
        }, jwt_secret, { expiresIn: '1d' });

        const _refreshToken = await user.getRefreshToken();
        if (!_refreshToken) {
            const tok = await RefreshToken.create({
                token: refreshToken
            });

            await tok.setUser(user);
            console.log('a', user);
            await user.setRefreshToken(tok);
            // await user.createRefreshToken({
            //     token: refreshToken
            // });
        }

        res.status(200).send({
            accessToken,
            refreshToken,
        });
    },

    refresh: async (req, res) => {
        const user = await User.findOne({
            where: {
                id: req.body.id,
            }
        });

        if (!user) return res.status(500).send('User not found');
        
        const userRefreshToken = user.getToken();
        if (req.body.token !== userRefreshToken.token) return res.status(401).send('Invalid Token');

        const error = jwt.verify(userRefreshToken.token, jwt_secret, (err) => {
            if (err) return res.status(401).send('Invalid Token');
            else return null
        });
        console.log('userRefreshToken',userRefreshToken);
        if (!error) {
            const accessToken = jsonwebtoken.sign({
                userId: user.id,
                userEmail: user.email
            }, jwt_secret, { expiresIn: '30m' });

            const refreshToken = jsonwebtoken.sign({
                userId: user.id,
            }, jwt_secret, { expiresIn: '1d' });

            return res.status(200).send({
                accessToken,
                refreshToken
            })
        }

        return res.status(500).send('something went wrong');
    }
}