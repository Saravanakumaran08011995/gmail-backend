const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true }
  });
  
  // Create model for email collection
  const emailCollection = mongoose.model('EmailCollection', emailSchema);

  module.exports = emailCollection