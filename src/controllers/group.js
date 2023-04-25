const { User, Group, Message } = require('../db/models');

module.exports = {

    createGroup: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getGroups: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getGroup: async (req, res)=> {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    updateGroup: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    deleteGroup: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    }
}