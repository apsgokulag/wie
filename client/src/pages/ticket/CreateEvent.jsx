// Frontend logic for group creation form
// This would be in your React component

import { useState, useEffect } from 'react';

const CreateEvent = () => {
  const [userCapabilities, setUserCapabilities] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grp_type: 'admin', // default
    email: '',
    contact_no: '',
    address: '',
    organisation_type: '',
    gst_no: '',
    pan_no: '',
    id_proof: '',
    bank_check: '',
    company_certificate: '',
    company_logo: ''
  });

  useEffect(() => {
    // Fetch user capabilities when component mounts
    fetchUserCapabilities();
  }, []);

  const fetchUserCapabilities = async () => {
    try {
      const response = await fetch('/api/user-group-capabilities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserCapabilities(data);
      
      // If user is organisation, force grp_type to 'organisation'
      if (data.userRole === 'organisation') {
        setFormData(prev => ({ ...prev, grp_type: 'organisation' }));
      }
    } catch (error) {
      console.error('Error fetching capabilities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Group created successfully!');
        // Reset form or redirect
      } else {
        alert(result.message || 'Error creating group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Network error occurred');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userCapabilities) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Group</h2>
      
      {/* Group Type Radio Buttons - Only show for admin */}
      {userCapabilities.showGroupTypeRadio && (
        <div>
          <label>Group Created Under:</label>
          <div>
            <input
              type="radio"
              id="admin_group"
              name="grp_type"
              value="admin"
              checked={formData.grp_type === 'admin'}
              onChange={handleInputChange}
            />
            <label htmlFor="admin_group">Admin</label>
          </div>
          <div>
            <input
              type="radio"
              id="organisation_group"
              name="grp_type"
              value="organisation"
              checked={formData.grp_type === 'organisation'}
              onChange={handleInputChange}
            />
            <label htmlFor="organisation_group">Organisation</label>
          </div>
        </div>
      )}
      
      {/* If user is organisation, show disabled radio button */}
      {userCapabilities.userRole === 'organisation' && (
        <div>
          <label>Group Created Under:</label>
          <div>
            <input
              type="radio"
              id="organisation_group_disabled"
              name="grp_type"
              value="organisation"
              checked={true}
              disabled={true}
            />
            <label htmlFor="organisation_group_disabled">Organisation (Default)</label>
          </div>
        </div>
      )}

      {/* Basic Fields */}
      <div>
        <label>Group Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Contact Number:</label>
        <input
          type="tel"
          name="contact_no"
          value={formData.contact_no}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>PAN Number:</label>
        <input
          type="text"
          name="pan_no"
          value={formData.pan_no}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>ID Proof:</label>
        <input
          type="text"
          name="id_proof"
          value={formData.id_proof}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Organisation-specific fields */}
      {formData.grp_type === 'organisation' && (
        <>
          <div>
            <label>Organisation Type:</label>
            <select
              name="organisation_type"
              value={formData.organisation_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Organisation Type</option>
              <option value="Private">Private</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Educational">Educational</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Company Certificate:</label>
            <input
              type="text"
              name="company_certificate"
              value={formData.company_certificate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Company Logo:</label>
            <input
              type="text"
              name="company_logo"
              value={formData.company_logo}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      {/* Optional fields */}
      <div>
        <label>GST Number:</label>
        <input
          type="text"
          name="gst_no"
          value={formData.gst_no}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Bank Check:</label>
        <input
          type="text"
          name="bank_check"
          value={formData.bank_check}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateEvent;