import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerOrganisation } from '../../services/authService';

const OrganisationSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    organisation_type: '',
    address: '',    
    password: '',
    confirm: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm) return setError('Passwords do not match');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('contact_no', formData.contact_no);
    data.append('organisation_type', formData.organisation_type);
    data.append('address', formData.address);
    data.append('password', formData.password);
    if (formData.image) data.append('image', formData.image);

   try {
  await registerOrganisation(data);
  navigate('/otp', { state: { email: formData.email } }); // redirect with email
} catch (err) {
  setError(err.response?.data?.message || 'Registration failed');
}
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Organisation Register</h2>
        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm mb-1">Organisation Name</label>
          <input name="name" required value={formData.name} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Contact Number</label>
          <input name="contact_no" required value={formData.contact_no} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Organisation Type</label>
          <select name="organisation_type" required value={formData.organisation_type} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400">
            <option value="">Select organization type</option>
              <option value="Private">Private Company</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Educational">Educational Institution</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Official Address</label>
          <input name="address" required value={formData.address} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Profile Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange}
            className="w-full text-sm text-gray-500" />
          {preview && <img src={preview} alt="preview" className="mt-2 w-24 h-24 rounded-full object-cover" />}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Confirm Password</label>
          <input type="password" name="confirm" required value={formData.confirm} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Signup
        </button>
      </form>
    </div>
  );
};
export default OrganisationSignup;