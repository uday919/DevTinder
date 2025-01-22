const { auth } = require('./middlewares/auth');
const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR :' + err.message);
  }
});

app.post('/sendConnectionRequest', auth, async (req, res) => {
  const user = req.user;
  console.log('sending a connection request');
  res.send(user.firstName + 'sent the connection request');
});

app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send('user not found');
    } else {
      res.send(users);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send('User not found');
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age'];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new error('Update not allowed');
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    console.log(user);
    res.send('user updated successfully');
  } catch (err) {
    res.status(400).send('something went wrong' + err.message);
  }
});
connectDB()
  .then(() => {
    console.log('Database connection established');

    app.listen(3000, () => {
      console.log('server started');
    });
  })
  .catch((err) => {
    console.error('Database cannot be connected');
  });
