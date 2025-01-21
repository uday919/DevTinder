const mongoose = require('mongoose');
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
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://cdn.vectorstock.com/i/500p/11/69/blank-avatar-profile-picture-vector-45161169.jpg',
    },
    about: {
      type: String,
      default: 'This is a default about of the user',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', useSchema);
