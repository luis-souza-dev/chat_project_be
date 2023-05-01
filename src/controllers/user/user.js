const { User } = require('../../db/models');
const bcrypt = require ('bcrypt');

module.exports = {

    createUser: async (req, res) => {
        try {
            const [newUser, created] = await User.findOrCreate({
                where: {
                    email: req.body.email,
                },
                defaults: {
                    pwd: bcrypt.hashSync(req.body.pwd, 10),
                    name: req.body.name,
                    status: 'active',
                }
            });
            if (!created) return res.status(500).send('Email already in use');

            return res.status(200).send(newUser);
        }
        catch (err) {
            return res.status(500).send(err);
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                where: req.query
            });
            return res.status(200).send(users);
        }
        catch (err) {
            if (err.original && err.original.routine === 'errorMissingColumn')
                return res.status(400).send('Bad query params');

            return res.status(500).send(err);
        }
        
    },

    getUser: async (req, res)=> {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).send(user);
        }
        catch (err) {
            return res.status(404).send('User Not found');
        }
    },

    updateUser: async (req, res) => {
       try {
           await User.update(req.body, {
                where: {
                    id: req.body.id
                }
            });

            return res.status(200).send('User updated successfully');
       }
       catch (err) {
            return res.status(500).send('Invalid record');
       }
    },
    
    deleteUser: async (req, res) => {
        try {
            await User.destroy({
                 where: {
                     id: req.body.id
                 }
             });
            return res.status(200).send('User deleted successfully');
        }
        catch (err) {
            return res.status(500).send('Something went wrong');
        }
    },
}