const express = require("express");
const userRouter = require('./user-routes');
const groupRouter = require('./group-routes');
const messageRouter = require('./message-routes');
const authRouter = require('./auth-routes');
const { verifyJwt } = require('./middlewares/auth-middleware');

const router = express.Router();

router.use('/user', verifyJwt, userRouter);
router.use('/group', verifyJwt, groupRouter);
router.use('/message', verifyJwt, messageRouter);
router.use('/auth', authRouter);

module.exports = router