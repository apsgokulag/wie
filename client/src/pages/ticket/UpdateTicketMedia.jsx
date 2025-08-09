import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateTicketMedia } from '../../services/ticketService';

const UpdateTicketMedia = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    media: null,
  });
  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTicketMedia({ ticketId, ...formData });
      navigate(`/ticket/view/${ticketId}`);
    } catch (error) {
      console.error("Error updating ticket media:", error);
    }
  };

  return (
    <div>
      <h2>Update Ticket Media</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};
export default UpdateTicketMedia;
        