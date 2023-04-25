const express = require("express");
const messageController = require('../controllers/message');

const router = express.Router();

router.get('/', messageController.getMessages);
router.get('/:id', messageController.getMessage);
router.post('/', messageController.createMessage);
router.put('/', messageController.updateMessage);
router.delete('/', messageController.deleteMessage);

module.exports = router