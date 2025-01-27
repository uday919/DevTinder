const express = require('express');
const userRouter = express.Router();
const { auth } = require('../middlewares/auth');
const { connection } = require('mongoose');
const ConnectionRequests = require('../models/connectionRequest');
//Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', ['firstName', 'lastName']);
    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400), send('ERROR: ' + err.message);
  }
});
module.exports = userRouter;
