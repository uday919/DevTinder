const { auth } = require('./auth');
const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User({
    firstName: 'uday',
    lastName: 'kiran',
    emailId: 'kiran@gmail.com',
    password: '2123',
  });
  try {
    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(400).send('Error saving the user');
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
