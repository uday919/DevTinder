const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const useSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new error('Invalid email address' + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new error('Enter a strong password' + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://cdn.vectorstock.com/i/500p/11/69/blank-avatar-profile-picture-vector-45161169.jpg',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new error('Invalid photo url' + value);
        }
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user',
    },
    skills: {
      type: [String],
      minLength: 5,
    },
  },
  {
    timestamps: true,
  }
);
useSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder', {
    expiresIn: '7d',
  });
  return token;
};
useSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model('User', useSchema);
