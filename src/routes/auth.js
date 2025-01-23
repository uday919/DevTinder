const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(400).send('Error :' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send('login successful');
    } else {
      throw new Error('invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Error :' + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send('Logout Successful');
});
module.exports = authRouter;
