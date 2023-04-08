const Email = require('../models/Email');

const createEmail = async (req, res) => {
  const { sender, recipients, subject, body } = req.body;
  const email = new Email({
    sender,
    recipients,
    subject,
    body,
  });

  try {
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEmails = async (req, res) => {
  const { isStarred, isDeleted } = req.query;
  const conditions = { isDeleted: false };
  if (isStarred) {
    conditions.isStarred = true;
  }
  if (isDeleted) {
    conditions.isDeleted = true;
  }

  try {
    const emails = await Email.find(conditions).sort('-createdAt');
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { ...req.body, isRead: true },
      { new: true }
    );
    res.json(updatedEmail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    await Email.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmail,
  getEmails,
  getEmail,
  updateEmail,
  deleteEmail,
};
