const express = require('express');
const { auth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();
profileRouter.get('/profile/view', auth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR :' + err.message);
  }
});
profileRouter.patch('/profile/edit', auth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('invalid edit request');
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send('Edit was successful');
    console.log(loggedInUser);
  } catch (err) {
    res.status(400).send('ERROR :' + err.message);
  }
});
module.exports = profileRouter;
