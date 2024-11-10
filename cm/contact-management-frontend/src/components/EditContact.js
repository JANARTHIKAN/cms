import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import img1 from '../components/image/6.png';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    position: '',
    domain: '',
    timetable: {
      Monday: Array(8).fill(''),
      Tuesday: Array(8).fill(''),
      Wednesday: Array(8).fill(''),
      Thursday: Array(8).fill(''),
      Friday: Array(8).fill(''),
      Saturday: Array(8).fill(''),
    },
    profilePicture: null,
  });

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://localhost:5000/api/contacts/getcontact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };
    fetchContact();
  }, [id]);

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
    formData.append('name', contact.name);
    formData.append('email', contact.email);
    formData.append('phone', contact.phone);
    formData.append('description', contact.description);
    formData.append('position', contact.position);
    formData.append('domain', contact.domain);

    if (contact.profilePicture) {
      formData.append('profilePicture', contact.profilePicture);
    }

    formData.append('timetable', JSON.stringify(contact.timetable));

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:5000/api/contacts/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  return (
    <div style={styles.editContactContainer}>
      <div style={styles.overlay}></div>
      <h2 style={styles.title}>Edit Contact</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          value={contact.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={contact.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={contact.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={contact.description}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          type="text"
          name="position"
          placeholder="Enter position"
          value={contact.position}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="domain"
          placeholder="Enter domain"
          value={contact.domain}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="file"
          name="profilePicture"
          onChange={handleChange}
          style={styles.fileInput}
          accept="image/*"
        />

        <h3>Timetable (6 days, 8 hours each)</h3>
        <table style={styles.timetableTable}>
          <thead>
            <tr style={styles.timetableHeader}>
              <th style={styles.timetableDayCell}>Day</th>
              {Array.from({ length: 8 }).map((_, index) => (
                <th key={index} style={styles.timetableHourCell}>
                  Hour {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
              (day) => (
                <tr key={day} style={styles.timetableRow}>
                  <td style={styles.timetableDayCell}>{day}</td>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <td key={index} style={styles.timetableHourCell}>
                      <input
                        type="text"
                        placeholder={`Class ${index + 1}`}
                        value={contact.timetable[day][index]}
                        onChange={(e) =>
                          handleTimetableChange(day, index, e.target.value)
                        }
                        style={styles.timetableInput}
                      />
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>

        <button type="submit" style={styles.button}>Update Contact</button>
      </form>
    </div>
  );
};

// Styles for the EditContact component
const styles = {
  editContactContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundImage: `url(${img1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#f7f7f7',
    textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '60%',
    zIndex: 2,
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.3s',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    fontSize: '1rem',
    minHeight: '80px',
    outline: 'none',
    transition: '0.3s',
  },
  fileInput: {
    width: '100%',
    margin: '10px 0',
    color: '#fff',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
    zIndex: 2,
  },
  timetableTable: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  timetableHeader: {
    backgroundColor: '#00004c',
    color: '#fff',
    fontSize: '1rem',
  },
  timetableRow: {
    display: 'table-row',
  },
  timetableDayCell: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#00004c',
    fontSize: '1rem',
  },
  timetableHourCell: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  timetableInput: {
    width: '100%',
    padding: '1px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    fontSize: '0.9rem',
    outline: 'none',
    transition: '0.3s',
  },
};

export default EditContact;
