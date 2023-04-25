const express = require("express");
const groupController = require('../controllers/group/group');

const router = express.Router();

router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroup);
router.post('/', groupController.createGroup);
router.put('/', groupController.updateGroup);
router.delete('/', groupController.deleteGroup);

module.exports = router