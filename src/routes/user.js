const express = require('express');
const userRouter = express.Router();
const { auth } = require('../middlewares/auth');
const { connection } = require('mongoose');
const ConnectionRequests = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender';
//Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400), send('ERROR: ' + err.message);
  }
});

userRouter.get('/user/connections', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequests.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: 'accepted',
        },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    }).populate('fromUserId', USER_SAFE_DATA);
    const data = connectionRequests.map((row) => row.fromUserId);
    res.json({ data: data });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});
module.exports = userRouter;
