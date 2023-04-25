const { User } = require('../../db/models');
const bcrypt = require ('bcrypt');

module.exports = {

    createUser: async (req, res) => {
        try {
            const [newUser, created] = await User.findOrCreate({
                where: {
                    name: req.body.name,
                    email: req.body.email,
                },
                defaults: {
                    pwd: bcrypt.hashSync(req.body.pwd, 10),
                    status: 'active',
                }
            });
            if (!created) res.status(500).send('User already exists');

            res.status(200).send(newUser);
        }
        catch (err) {
            res.status(500).send(err);
        }
        
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                where: req.query
            });
            res.status(200).send(users);
        }
        catch (err) {
            if (err.original.routine === 'errorMissingColumn')
                res.status(400).send('Bad query params');
        }
        
    },
    getUser: async (req, res)=> {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(user);
        }
        catch (err) {
            res.status(404).send('User Not found');
        }
    },
    updateUser: async (req, res) => {
       try {
           await User.update(req.body, {
                where: {
                    id: req.body.id
                }
            });

            res.status(200).send('User updated successfully');
       }
       catch (err) {
            res.status(500).send('Invalid record');
       }
    },
    deleteUser: async (req, res) => {
        
        try {
            await User.destroy({
                 where: {
                     id: req.body.id
                 }
             });
            res.status(200).send('User deleted successfully');
        }
        catch (err) {
            res.status(500).send('Something went wrong');
        }
        
    }
}