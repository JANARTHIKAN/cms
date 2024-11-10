const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    position: { type: String }, // New field for position
    domain: { type: String }, // New field for domain
    profilePicture: Buffer,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model

    // Timetable schema for 6 days and 8 hours each day
    timetable: {
      Monday: { type: [String], default: Array(8).fill('') },
      Tuesday: { type: [String], default: Array(8).fill('') },
      Wednesday: { type: [String], default: Array(8).fill('') },
      Thursday: { type: [String], default: Array(8).fill('') },
      Friday: { type: [String], default: Array(8).fill('') },
      Saturday: { type: [String], default: Array(8).fill('') },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
