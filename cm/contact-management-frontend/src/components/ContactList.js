// src/components/ContactList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://contact-manager-server-up3q.onrender.com/api/contacts'); // Adjust URL as needed
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="contact-list-container">
      <h2>Contacts</h2>
      {contacts.map((contact) => (
        <Link key={contact._id} to={`/contacts/${contact._id}`} className="contact-item">
          {contact.name}
        </Link>
      ))}
    </div>
  );
};

export default ContactList;
