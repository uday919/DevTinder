const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://udaykiran:9908806416uU%40@nodejs.1uffk.mongodb.net/devTinder '
  );
};

module.exports = connectDB;
