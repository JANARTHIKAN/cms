import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './ContactStyles.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContact, setExpandedContact] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [contactToDelete, setContactToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/contacts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const toggleDetails = (contact) => {
    setExpandedContact(contact || null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-contact/${id}`);
  };

  const handleDeleteClick = (id) => {
    setContactToDelete(id);
    setPasswordModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(
        `https://contact-manager-server-up3q.onrender.com/api/contacts/delete/${contactToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response);

      if (response.status === 200) {
        setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== contactToDelete));
        setPasswordModalOpen(false);
        setPassword('');
        setContactToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('An error occurred while deleting the contact. Please try again.');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="contacts-container">
      <div className="header">
        <div className="info">
          <h2>Contact List</h2>
          <p>Total Contacts: {contacts.length}</p>
          <Link to="/create-contact" className="create-contact-button">Create Contact</Link>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {filteredContacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        filteredContacts.map((contact) => (
          <div key={contact._id} className="contact-card">
            {contact.profilePicture ? (
              <img
                src={contact.profilePicture}
                alt="Profile"
                className="contact-image"
              />
            ) : (
              <div className="empty-image-circle"></div>
            )}
            <div className="contact-info">
              <h3>{contact.name}</h3>
              <p>{contact.phone}</p>
            </div>
            <div className="contact-actions">
              <FaEye
                className="action-icon view-icon"
                title="View"
                onClick={() => toggleDetails(contact)}
              />
              <FaEdit
                className="action-icon edit-icon"
                title="Edit"
                onClick={() => handleEdit(contact._id)}
              />
              <FaTrash
                className="action-icon delete-icon"
                title="Delete"
                onClick={() => handleDeleteClick(contact._id)}
              />
            </div>
          </div>
        ))
      )}

      {expandedContact && (
        <div className="modal">
          <div className="modal-content large-modal">
            <span className="close-button" onClick={() => toggleDetails(null)}>&times;</span>
            <h2 className="modal-title">Contact Details</h2>
            <div className="modal-body">
              <img
                src={expandedContact.profilePicture || 'default-image-path.jpg'}
                alt="Profile"
                className="contact-image-large"
              />
              <div className="modal-details">
                <p><span className="label">Name:</span> {expandedContact.name}</p>
                <p><span className="label">Phone:</span> {expandedContact.phone}</p>
                <p><span className="label">Email:</span> {expandedContact.email}</p>
                <p><span className="label">Position:</span> {expandedContact.position}</p>
                <p><span className="label">Domain:</span> {expandedContact.domain}</p>

                <h3 className="timetable-heading">Timetable</h3>
                <table className="timetable">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>8:45 - 9:45</th>
                      <th>9:45 - 10:25</th>
                      <th>10:45 - 11:30</th>
                      <th>11:30 - 12:15</th>
                      <th>1:15 - 2:00</th>
                      <th>2:00 - 2:45</th>
                      <th>3:00 - 3:45</th>
                      <th>3:45 - 4:30</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <tr key={day}>
                        <td>{day}</td>
                        {Array.from({ length: 8 }).map((_, hourIndex) => (
                          <td key={hourIndex}>
                            {expandedContact.timetable && expandedContact.timetable[day]
                              ? expandedContact.timetable[day][hourIndex] || "Free"
                              : "Free"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setPasswordModalOpen(false)}>&times;</span>
            <h2>Confirm Delete</h2>
            <p>Please enter your password to confirm the deletion:</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button onClick={handleDelete} className="confirm-delete-button">Confirm Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
