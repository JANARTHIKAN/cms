const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');

// Set up Multer for handling image uploads as buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

const authenticate = require('../middleware/authMiddleware'); // Middleware for authentication

// Create a new contact
router.post(
  '/addcontacts',
  authenticate,
  upload.single('profilePicture'),
  async (req, res) => {
    const { name, email, phone, description, position, domain, timetable, userId } = req.body;
    const profilePicture = req.file ? req.file.buffer : null;

    // Parse timetable from JSON if provided
    let parsedTimetable = {};
    if (timetable) {
      try {
        parsedTimetable = JSON.parse(timetable);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid timetable format' });
      }
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      description,
      position,
      domain,
      profilePicture,
      timetable: parsedTimetable,
      userId,
    });

    try {
      const savedContact = await newContact.save();
      res.status(201).json(savedContact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all contacts for the authenticated user
router.get('/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch contacts filtered by userId
    const contacts = await Contact.find({ userId });

    // Convert profile pictures to Base64
    const contactsWithBase64 = contacts.map((contact) => {
      const profilePicture = contact.profilePicture
        ? `data:image/png;base64,${contact.profilePicture.toString('base64')}`
        : null;
      return { ...contact.toObject(), profilePicture };
    });

    res.json(contactsWithBase64);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a contact by ID
router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found or unauthorized' });
    }
    res.status(200).json({ message: 'Contact deleted successfully', deletedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a contact by ID
router.put('/edit/:id', authenticate, upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;
  const { timetable } = req.body;

  // If a new profile picture is uploaded, set it in req.body
  if (req.file) {
    req.body.profilePicture = req.file.buffer;
  }

  // Parse timetable from JSON if provided
  if (timetable) {
    try {
      req.body.timetable = JSON.parse(timetable);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid timetable format' });
    }
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const updatedContactWithBase64 = {
      ...updatedContact.toObject(),
      profilePicture: updatedContact.profilePicture
        ? `data:image/png;base64,${updatedContact.profilePicture.toString('base64')}`
        : null,
    };

    res.status(200).json(updatedContactWithBase64);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single contact by ID
router.get('/getcontact/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
