import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreationGroup, getUserGroupCapabilities } from '../../services/ticketService';
import './CreateGroup.css';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    address: '',
    gst_no: '',
    pan_no: '',
    id_proof: '',
    bank_check: '',
    company_certificate: '',
    company_logo: '',
    organisation_type: '',
    grp_type: 'organisation' // Default to organisation
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserCapabilities();
  }, []);

  const fetchUserCapabilities = async () => {
    try {
      const caps = await getUserGroupCapabilities();
      setCapabilities(caps);
      // If user is not admin, set default to organisation
      if (caps.userRole !== 'admin') {
        setFormData(prev => ({ ...prev, grp_type: 'organisation' }));
      }
    } catch (error) {
      console.error('Error fetching capabilities:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contact_no.trim()) newErrors.contact_no = 'Contact number is required';
    if (!formData.pan_no.trim()) newErrors.pan_no = 'PAN number is required';
    if (!formData.id_proof.trim()) newErrors.id_proof = 'ID proof is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Contact number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contact_no && !phoneRegex.test(formData.contact_no)) {
      newErrors.contact_no = 'Contact number must be 10 digits';
    }

    // Organisation specific validations
    if (formData.grp_type === 'organisation') {
      if (!formData.organisation_type.trim()) {
        newErrors.organisation_type = 'Organisation type is required for organisation groups';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required for organisation groups';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await CreationGroup(formData);
      
      // Success - navigate to view groups page
      navigate('/ticket/groups', { 
        state: { 
          message: 'Group created successfully!',
          newGroup: response.group 
        }
      });
    } catch (error) {
      console.error('Error creating group:', error);
      
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          // Try to map error to field (basic mapping)
          if (err.includes('email')) backendErrors.email = err;
          else if (err.includes('contact')) backendErrors.contact_no = err;
          else if (err.includes('name')) backendErrors.name = err;
          else backendErrors.general = err;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'An error occurred while creating the group. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  if (!capabilities) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-group-container">
      <div className="create-group-card">
        <div className="header-actions">
            <button className="btn-back" onClick={handleBack}>
                <span className="back-icon">←</span>
                Back
            </button>
        </div>
        <h2>Create New Group</h2>
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="create-group-form">
          {/* Group Type Selection (only for admin) */}
          {capabilities.userRole === 'admin' && (
            <div className="form-group">
              <label>Group Type *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="grp_type"
                    value="admin"
                    checked={formData.grp_type === 'admin'}
                    onChange={handleInputChange}
                  />
                  Admin Group
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="grp_type"
                    value="organisation"
                    checked={formData.grp_type === 'organisation'}
                    onChange={handleInputChange}
                  />
                  Organisation Group
                </label>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Group Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter group name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact_no">Contact Number *</label>
              <input
                type="tel"
                id="contact_no"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleInputChange}
                className={errors.contact_no ? 'error' : ''}
                placeholder="Enter 10-digit contact number"
                maxLength="10"
              />
              {errors.contact_no && <span className="error-text">{errors.contact_no}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pan_no">PAN Number *</label>
              <input
                type="text"
                id="pan_no"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleInputChange}
                className={errors.pan_no ? 'error' : ''}
                placeholder="Enter PAN number"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.pan_no && <span className="error-text">{errors.pan_no}</span>}
            </div>
          </div>

          {/* Organisation-specific fields */}
          {formData.grp_type === 'organisation' && (
            <>
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter complete address"
                  rows="3"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="organisation_type">Organisation Type *</label>
                <select
                  id="organisation_type"
                  name="organisation_type"
                  value={formData.organisation_type}
                  onChange={handleInputChange}
                  className={errors.organisation_type ? 'error' : ''}
                >
                  <option value="">Select organisation type</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Government">Proprietorship</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="NGO">NGO</option>
                  <option value="Educational">Educational</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Non-profit">Non-profit</option>
                  <option value="Trust">Trust</option>
                  <option value="Society">Society</option>
                  <option value="Other">Other</option>
                </select>
                {errors.organisation_type && <span className="error-text">{errors.organisation_type}</span>}
              </div>
            </>
          )}

          {/* Optional Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gst_no">GST Number</label>
              <input
                type="text"
                id="gst_no"
                name="gst_no"
                value={formData.gst_no}
                onChange={handleInputChange}
                placeholder="Enter GST number (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_proof">ID Proof *</label>
              <input
                type="text"
                id="id_proof"
                name="id_proof"
                value={formData.id_proof}
                onChange={handleInputChange}
                className={errors.id_proof ? 'error' : ''}
                placeholder="Enter ID proof details"
              />
              {errors.id_proof && <span className="error-text">{errors.id_proof}</span>}
            </div>
          </div>

          <div className="form-row">


            {formData.grp_type === 'organisation' && (
              <div className="form-group">
                <label htmlFor="company_certificate">Company Certificate</label>
                <input
                  type="text"
                  id="company_certificate"
                  name="company_certificate"
                  value={formData.company_certificate}
                  onChange={handleInputChange}
                  placeholder="Enter company certificate details (optional)"
                />
              </div>
            )}
          </div>

          {formData.grp_type === 'organisation' && (
            <div className="form-group">
              <label htmlFor="company_logo">Company Logo URL</label>
              <input
                type="url"
                id="company_logo"
                name="company_logo"
                value={formData.company_logo}
                onChange={handleInputChange}
                placeholder="Enter company logo URL (optional)"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/groups')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateGroup;
