const express = require('express');
const requestRouter = express.Router();
const { auth } = require('../middlewares/auth');
requestRouter.post('/sendConnectionRequest', auth, async (req, res) => {
  const user = req.user;
  console.log('sending a connection request');
  res.send(user.firstName + 'sent the connection request');
});
module.exports = requestRouter;
