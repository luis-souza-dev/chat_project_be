const { User, Group, Message } = require('../db/models');

module.exports = {

    createUser: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getUsers: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getUser: async (req, res)=> {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    updateUser: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    deleteUser: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    }
}