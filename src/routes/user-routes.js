const express = require("express");
const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.post('/', userController.createUser);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

module.exports = router