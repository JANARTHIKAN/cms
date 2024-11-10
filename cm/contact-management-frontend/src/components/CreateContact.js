import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactStyles.css'; // Import your CSS styles

const CreateContact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    position: '',
    domain: '',
    profilePicture: null,
    timetable: {
      Monday: Array(8).fill(''), // Initialize timetable for each day with 8 empty slots
      Tuesday: Array(8).fill(''),
      Wednesday: Array(8).fill(''),
      Thursday: Array(8).fill(''),
      Friday: Array(8).fill(''),
      Saturday: Array(8).fill(''),
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setContact({ ...contact, profilePicture: files[0] });
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const handleTimetableChange = (day, index, value) => {
    setContact((prevContact) => {
      const updatedTimetable = { ...prevContact.timetable };
      updatedTimetable[day][index] = value;
      return { ...prevContact, timetable: updatedTimetable };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    formData.append('userId', userId); // Include userId in the request
    formData.append('name', contact.name);
    formData.append('email', contact.email);
    formData.append('phone', contact.phone);
    formData.append('description', contact.description);
    formData.append('position', contact.position);
    formData.append('domain', contact.domain);

    if (contact.profilePicture) {
      formData.append('profilePicture', contact.profilePicture);
    }

    // Append timetable as a JSON string
    formData.append('timetable', JSON.stringify(contact.timetable));

    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      const response = await axios.post(
        'http://localhost:5000/api/contacts/addcontacts',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      navigate('/contacts'); // Navigate back to contacts list
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  return (
    <div className="create-contact-container">
      <h2>Create Faculty Contact</h2>
      <form onSubmit={handleSubmit} className="create-contact-form">
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          value={contact.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={contact.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={contact.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={contact.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Enter position"
          value={contact.position}
          onChange={handleChange}
        />
        <input
          type="text"
          name="domain"
          placeholder="Enter domain"
          value={contact.domain}
          onChange={handleChange}
        />
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />

        <h3>Timetable (8 hours for 6 days)</h3>
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Day</th>
              {Array.from({ length: 8 }).map((_, index) => (
                <th key={index}>Hour {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
              (day) => (
                <tr key={day}>
                  <td>{day}</td>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <td key={index}>
                      <input
                        type="text"
                        placeholder={`Class ${index + 1}`}
                        value={contact.timetable[day][index]}
                        onChange={(e) =>
                          handleTimetableChange(day, index, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>

        <button type="submit">Save Contact</button>
      </form>
    </div>
  );
};

export default CreateContact;
