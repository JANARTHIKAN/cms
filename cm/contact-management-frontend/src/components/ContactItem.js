// ContactItem.js
import React from 'react';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa'; // Correct import

const ContactItem = ({ contact, onEdit, onDelete, onFavorite }) => {
  return (
    <div className="contact-item">
      <h5>{contact.name}</h5>
      <p>{contact.phone}</p>
      <button onClick={onEdit}>
        <FaEdit /> Edit
      </button>
      <button onClick={onDelete}>
        <FaTrash /> Delete
      </button>
      <button onClick={onFavorite}>
        <FaStar /> Favorite
      </button>
    </div>
  );
};

export default ContactItem;
