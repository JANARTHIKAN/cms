const Contact = require('../models/Contact');

// Function to get all contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a new contact
const createContact = async (req, res) => {
  const { name, email, phone, description, position, domain, timetable } = req.body;
  
  // Parse the timetable if it is sent as a JSON string
  let parsedTimetable;
  try {
    parsedTimetable = timetable ? JSON.parse(timetable) : {}; 
  } catch (error) {
    return res.status(400).json({ message: "Invalid timetable format" });
  }

  // Create a new contact with the additional fields
  const contact = new Contact({
    name,
    email,
    phone,
    description,
    position,
    domain,
    timetable: parsedTimetable,
    profilePicture: req.file ? req.file.path : null, // Assuming you're using multer for file uploads
  });

  try {
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getContacts, createContact };
