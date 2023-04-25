const { User, Group, Message } = require('../db/models');

module.exports = {

    createMessage: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getMessages: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    getMessage: async (req, res)=> {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    updateMessage: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    },
    deleteMessage: async (req, res) => {
        console.log(req.body);
        
        res.send('sucessoooo');
    }
}