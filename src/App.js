import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    const deletedIds = JSON.parse(localStorage.getItem("deletedContacts")) || [];
    
    axios.get("https://jsonplaceholder.typicode.com/comments?postId=1")
      .then(response => {
        const fetchedContacts = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          phoneNumber: item.email  // Using email as a placeholder for phone number
        })).filter(contact => !deletedIds.includes(contact.id));
        
        const existingIds = new Set(savedContacts.map(contact => contact.id));
        const newContacts = fetchedContacts.filter(fc => !existingIds.has(fc.id));
        const mergedContacts = [...savedContacts, ...newContacts];
        
        setContacts(mergedContacts);
        localStorage.setItem("contacts", JSON.stringify(mergedContacts));
      })
      .catch(error => console.error("Error fetching contacts:", error));
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  const createContact = () => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert("Name and Phone Number or mail cannot be empty!");
      return;
    }
    
    if (contacts.some(contact => contact.name === name && contact.phoneNumber === phoneNumber)) {
      alert("Contact already exists!");
      return;
    }

    const newContact = { id: Date.now(), name, phoneNumber };
    const updatedContacts = [newContact, ...contacts];
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    setName("");
    setPhoneNumber("");
  };

  const updateContact = (id) => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert("Name and Phone Number and mail cannot be empty!");
      return;
    }

    const updatedContacts = contacts.map(contact => contact.id === id ? { ...contact, name, phoneNumber } : contact);
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    setEditingId(null);
    setName("");
    setPhoneNumber("");
  };

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    
    const deletedIds = JSON.parse(localStorage.getItem("deletedContacts")) || [];
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("deletedContacts", JSON.stringify(deletedIds));
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Contact Management</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number or mail"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="create-button" onClick={editingId ? () => updateContact(editingId) : createContact}>
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Phone Number/mail"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="post-list">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.phoneNumber}</td>
                <td>
                  <button className="icon-button edit" onClick={() => {
                    setEditingId(contact.id);
                    setName(contact.name);
                    setPhoneNumber(contact.phoneNumber);
                  }}>
                    ✏️
                  </button>
                </td>
                <td>
                  <button className="icon-button delete" onClick={() => deleteContact(contact.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
