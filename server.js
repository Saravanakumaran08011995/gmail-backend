const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const emailModel = require('./models/Email');
const emailCollection = require('./models/EmailCollection') 
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

app.get('/',async(req,res)=>{
  try {
    res.json("I am working")
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
})

// Get all emails from the database
app.get('/api/emails', async (req, res) => {
  try {  
    const emails = await emailModel.find(); // retrieve emails from the database
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get sent emails from the database
app.get('/api/emails/sent', async (req, res) => {
  try {  
    const emails = await emailCollection.find(); // retrieve emails from the database
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { sender, to, subject, text } = req.body;

// validating email address    
    const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(to)) {
     return res.status(400).json({ message: 'Invalid email address' });
      }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
app.post('/api/save-email', async (req, res) => {
  try {
    const newEmail = new emailCollection({
      sender: req.body.sender,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text
    });

    await newEmail.save();

    res.status(200).json({ message: 'Email saved to database' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving the email to the database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
