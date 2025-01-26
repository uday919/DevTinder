const express = require('express');
const requestRouter = express.Router();
const { auth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post(
  '/request/send/:status/:toUserId',
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status type: ' + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          //$or is or method in mongoDB
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'connection request already exists!!!' });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + ' is ' + status + ' in ' + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  auth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      //Validate the status
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Status not allowed!' });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      //loggedInId==toUserId
      //status=interested
      //request id should be valid

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'connection request not found' });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: 'Connection request ' + status, data });
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);
module.exports = requestRouter;
