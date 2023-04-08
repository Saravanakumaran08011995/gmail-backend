const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  starred: {
    type: Boolean,
    required: true,
    default: false,
  },
  selected: {
    type: Boolean,
    required: true,
    default: false,
  },
  labels: {
    type: [String],
    required: true,
    default: [],
  },
});

const emailModel = mongoose.model('Email', emailSchema);  

module.exports = emailModel; 
