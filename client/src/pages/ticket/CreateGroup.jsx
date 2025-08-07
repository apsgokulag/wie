import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreationGroup, getUserGroupCapabilities } from '../../services/ticketService';
import WieLogo from '../../assets/Event/WieLogo.svg';
import BankIcon from '../../assets/Event/BankIcon.svg';
import InfoIcon from '../../assets/Event/InfoIcon.svg';
import MediaIcon from '../../assets/Event/MediaIcon.svg';
import NoteIcon from '../../assets/Event/NoteIcon.svg';
import OrgIcon from '../../assets/Event/OrgIcon.svg';
import PreviewIcon from '../../assets/Event/PreviewIcon.svg';
import TcIcon from '../../assets/Event/T&cIcon.svg';
import LightIcon from '../../assets/Event/LightIcon.svg';
import DarkIcon from '../../assets/Event/DarkIcon.svg';
import BackIcon from '../../assets/Event/BackIcon.svg';

// CSS for placeholders, which will be injected based on the theme
const darkThemeStyles = `
  .dark input::placeholder,
  .dark textarea::placeholder,
  .dark select {
    color: white !important;
    font-weight: 100 !important;
    opacity: 0.8 !important;
  }
  .dark select option:first-child {
    color: white !important;
    font-weight: 100 !important;
  }
  .dark select option {
    background: #212426;
    color: white;
  }
`;

const lightThemeStyles = `
  .light input::placeholder,
  .light textarea::placeholder,
  .light select {
    color: #718096 !important;
    font-weight: 100 !important;
    opacity: 1 !important;
  }
  .light select option:first-child {
    color: #718096 !important;
    font-weight: 100 !important;
  }
   .light select option {
    background: white;
    color: black;
  }
`;

const CreateGroup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [filePreviews, setFilePreviews] = useState({});
  const [hasGst, setHasGst] = useState(''); // Separate state for GST registration question
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    address: '',
    gst_no: '',
    pan_no: '',
    organisation_type: '',
    grp_type: 'organisation' // Default to organisation
  });
  
  // Separate state for files
  const [files, setFiles] = useState({
    id_proof: null,
    bank_check: null,
    company_certificate: null,
    company_logo: null
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let styleSheet = document.getElementById('dynamic-theme-styles');
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = 'dynamic-theme-styles';
      document.head.appendChild(styleSheet);
    }
    styleSheet.innerText = darkMode ? darkThemeStyles : lightThemeStyles;
  }, [darkMode]);

  useEffect(() => {
    fetchUserCapabilities();
  }, []);

  const fetchUserCapabilities = async () => {
    try {
      const caps = await getUserGroupCapabilities();
      setCapabilities(caps);
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGstChange = (e) => {
    const value = e.target.value;
    setHasGst(value);
    
    if (value === 'No') {
      setFormData(prev => ({ ...prev, gst_no: '' }));
    }
    
    if (errors.gst_no) {
      setErrors(prev => ({ ...prev, gst_no: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contact_no.trim()) newErrors.contact_no = 'Contact number is required';
    if (!formData.pan_no.trim()) newErrors.pan_no = 'PAN number is required';
    if (!files.id_proof) newErrors.id_proof = 'ID proof is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contact_no && !phoneRegex.test(formData.contact_no)) {
      newErrors.contact_no = 'Contact number must be 10 digits';
    }

    if (formData.grp_type === 'organisation') {
      if (!formData.organisation_type.trim()) {
        newErrors.organisation_type = 'Organisation type is required';
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
      if (!validateForm()) return;

      setLoading(true);
      try {
        // Create FormData for file upload
        const submitData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (formData[key] !== '') {
            submitData.append(key, formData[key]);
          }
        });
        
        // Append files
        Object.keys(files).forEach(key => {
          if (files[key]) {
            submitData.append(key, files[key]);
          }
        });

        console.log('Submitting form data:', formData);
        console.log('Submitting files:', files);
        
        // ✅ FIXED: Send submitData instead of formData
        const response = await CreationGroup(submitData);
        
        navigate(`/ticket/create-event/${response.group._id}`, {
          state: {
            message: 'Group created successfully!',
            newGroup: response.group 
          }
        });
      } catch (error) {
        console.error('Error creating group:', error);
        if (error.response?.data?.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('email')) backendErrors.email = err;
            else if (err.includes('contact')) backendErrors.contact_no = err;
            else if (err.includes('name')) backendErrors.name = err;
            else backendErrors.general = err;
          });
          setErrors(backendErrors);
        } else if (error.response?.data?.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'An error occurred. Please try again.' });
        }
      } finally {
        setLoading(false);
      }
  };
  const handleBack = () => navigate(-1);

  if (!capabilities) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  const handleFileUpload = (name, file) => {
    setFiles(prev => ({ ...prev, [name]: file }));

    const fileType = file?.type || '';
    const fileName = file?.name || '';

    let previewURL = '';

    if (fileType.startsWith('image/')) {
      previewURL = URL.createObjectURL(file);
    } else if (fileType === 'application/pdf') {
      previewURL = '/assets/Event/PdfIcon.svg'; // Static preview icon
    } else if (
      fileName.endsWith('.doc') || fileName.endsWith('.docx')
    ) {
      previewURL = '/assets/Event/DocIcon.svg';
    }

    if (previewURL) {
      setFilePreviews(prev => ({ ...prev, [name]: previewURL }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const FileUploadArea = ({ label, name }) => {
    const handleClick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
          handleFileUpload(name, file);
        } else if (file) {
          alert('File size must be less than 10MB');
        }
        input.value = '';
      };
      input.click();
    };
    
    const handleRemoveFile = (e) => {
      e.stopPropagation();
      setFiles(prev => ({ ...prev, [name]: null }));
      setFilePreviews(prev => ({ ...prev, [name]: null }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };
    
    const hasError = !!errors[name];
    const hasFile = !!files[name];

    return (
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
        <div
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer h-32 flex flex-col items-center justify-center relative
            ${darkMode
              ? `bg-[#212426] ${hasError ? 'border-red-500' : 'border-gray-600'} hover:border-gray-500`
              : `bg-white ${hasError ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`
            }`
          }
        >
          {hasFile ? (
            <>
              <div className="mb-2">
                <svg className={`w-8 h-8 mx-auto ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
             <div className="flex flex-col items-center space-y-2">
                {filePreviews[name] ? (
                  <img
                    src={filePreviews[name]}
                    alt="Preview"
                    className="h-20 object-contain rounded border"
                  />
                ) : (
                  <p className={`text-xs truncate max-w-full px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {files[name].name}
                  </p>
                )}
              </div>
              <button
                onClick={handleRemoveFile}
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                } transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <div className="mb-2">
                <svg className={`w-8 h-8 mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Drag your file(s) or <span className={darkMode ? "text-white hover:text-gray-200" : "text-indigo-600 hover:text-indigo-700"}>browse</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Max 10 MB files are allowed</p>
            </>
          )}
        </div>
        {hasError && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
      </div>
    );
  };

  const navigationSteps = [
    { id: 1, name: 'Group creation', icon: OrgIcon, active: true },
    { id: 2, name: 'Basic information', icon: InfoIcon, active: false },
    { id: 3, name: 'Media', icon: MediaIcon, active: false },
    { id: 4, name: 'Banking & tickets', icon: BankIcon, active: false },
    { id: 5, name: 'Terms & conditions', icon: TcIcon, active: false },
    { id: 6, name: 'Preview', icon: PreviewIcon, active: false }
  ];

  const BackButton = ({ onClick, isDarkMode }) => (
    <button onClick={onClick} className="rounded-full transition-colors">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: isDarkMode ? '#363A3F' : '#F3F4F6',
          boxShadow: isDarkMode
            ? 'inset 1px 1px 2px #1e2022, inset -1px -1px 2px #4e545c'
            : 'inset 1px 1px 2px #d1d5db, inset -1px -1px 2px #ffffff'
        }}
      >
        <img src={BackIcon} alt="Back" className={`w-3 h-3 ${!isDarkMode && 'filter invert'}`} />
      </div>
    </button>
  );

  return (
    // RESPONSIVE: The main flex container is always present.
    <div className={`min-h-screen flex ${darkMode ? 'dark' : 'light'}`}>
      {/* RESPONSIVE: Sidebar is hidden on screens smaller than lg (1024px) */}
      <div className={`hidden lg:flex w-[300px] p-6 flex-col transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex items-center space-x-2 mb-8">
          <img src={WieLogo} alt="Wie Logo" className="w-10 h-10" />
        </div>
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <BackButton onClick={handleBack} isDarkMode={darkMode} />
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create a new event</span>
          </div>
        </div>
        <div className="mb-8 flex justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="10" fill="none" className={darkMode ? "text-gray-700" : "text-gray-200"} />
              <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="10" fill="none" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * 0.79}`} className={darkMode ? "text-green-400" : "text-green-500"} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold">21%</span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>completed</span>
            </div>
          </div>
        </div>
        <nav className="space-y-2 -mx-6 px-6">
          {navigationSteps.map((step, index) => {
            const isActive = step.active;
            const stepIconClass = `w-4 h-4 transition-opacity duration-200 ${index !== 0 ? 'opacity-50' : ''} ${darkMode ? 'filter brightness-0 invert' : ''}`;
            const iconBgColor = index !== 0 ? (darkMode ? 'rgba(30, 18, 66, 0.5)' : 'rgba(30, 18, 66, 0.5)') : '#1E1242';

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-3 px-6 py-4 -mx-6 transition-colors rounded-lg
                  ${isActive
                    ? darkMode ? 'text-white' : 'text-indigo-700'
                    : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                style={isActive ? { backgroundColor: darkMode ? '#363A3F' : 'rgba(126, 126, 126, 0.2)' } : {}}
              >
                <img src={NoteIcon} alt="Note" className="w-4 h-4" />
                <span className="text-sm flex-1">{step.name}</span>
                <div
                  className="px-3 py-1.5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: iconBgColor }}
                >
                  <img
                    src={step.icon}
                    alt={step.name}
                    className={stepIconClass}
                  />
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-colors duration-300" style={{ backgroundColor: darkMode ? '#212426' : '#F9FAFB' }}>
        
        {/* RESPONSIVE: Mobile Header. Visible only on screens smaller than lg. */}
        <div className={`lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 border-b ${darkMode ? 'bg-[#212426] border-gray-700' : 'bg-[#F9FAFB] border-gray-200'}`}>
            <BackButton onClick={handleBack} isDarkMode={darkMode} />
            <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create Group</h1>
             {/* Theme switcher for mobile */}
             <div
              onClick={() => setDarkMode(!darkMode)}
              className="w-[70px] h-[36px] rounded-full cursor-pointer relative px-[3px] flex items-center justify-between transition-all duration-300"
              style={{
                background: darkMode ? '#212426' : '#E5E7EB',
                boxShadow: darkMode 
                  ? 'inset -1px -1px 2px rgba(255, 255, 255, 0.06), inset 1px 1px 3px rgba(0, 0, 0, 0.4)'
                  : 'inset 2px 2px 4px #cdd3da, inset -2px -2px 4px #fdffff'
              }}
            >
              <div
                className="absolute top-[3px] left-[3px] w-[30px] h-[30px] rounded-full transition-all duration-300 z-10"
                style={{
                  transform: darkMode ? 'translateX(34px)' : 'translateX(0)',
                  backgroundColor: darkMode ? '#2E2E2E' : '#FFFFFF',
                   boxShadow: darkMode 
                   ? 'inset -1px -1px 1px rgba(255, 255, 255, 0.05), inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
                   : '2px 2px 4px #cdd3da, -2px -2px 4px #fdffff'
                }}
              />
              <div className="w-[30px] h-[30px] flex items-center justify-center z-20">
                <img src={LightIcon} alt="Light Mode" className={`w-4 h-4 ${!darkMode ? 'filter brightness-0' : ''}`} />
              </div>
              <div className="w-[30px] h-[30px] flex items-center justify-center z-20">
                <img src={DarkIcon} alt="Dark Mode" className={`w-4 h-4 ${!darkMode ? 'filter brightness-0' : ''}`} />
              </div>
            </div>
        </div>

        {/* RESPONSIVE: Desktop theme switcher. Hidden on mobile. */}
        <div className="hidden lg:flex justify-end p-6">
          <div
            onClick={() => setDarkMode(!darkMode)}
            className="w-[92px] h-[48px] rounded-full cursor-pointer relative px-[4px] flex items-center justify-between transition-all duration-300"
            style={{
              background: darkMode ? '#212426' : '#E5E7EB',
              boxShadow: darkMode 
                ? 'inset -1px -1px 2px rgba(255, 255, 255, 0.06), inset 1px 1px 3px rgba(0, 0, 0, 0.4)'
                : 'inset 2px 2px 4px #cdd3da, inset -2px -2px 4px #fdffff'
            }}
          >
            <div
              className="absolute top-[4px] left-[4px] w-[40px] h-[40px] rounded-full transition-all duration-300 z-10"
              style={{
                transform: darkMode ? 'translateX(44px)' : 'translateX(0)',
                backgroundColor: darkMode ? '#2E2E2E' : '#FFFFFF',
                  boxShadow: darkMode 
                  ? 'inset -1px -1px 1px rgba(255, 255, 255, 0.05), inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
                  : '2px 2px 4px #cdd3da, -2px -2px 4px #fdffff'
              }}
            />
            <div className="w-[40px] h-[40px] flex items-center justify-center z-20">
              <img src={LightIcon} alt="Light Mode" className={`w-[18px] h-[18px] ${!darkMode ? 'filter brightness-0' : ''}`} />
            </div>
            <div className="w-[40px] h-[40px] flex items-center justify-center z-20">
              <img src={DarkIcon} alt="Dark Mode" className={`w-[18px] h-[18px] ${!darkMode ? 'filter brightness-0' : ''}`} />
            </div>
          </div>
        </div>

        {/* RESPONSIVE: Adjusted padding for different screen sizes */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* RESPONSIVE: Adjusted title size and margin for mobile */}
            <div className="text-center mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: darkMode ? '#1E1242' : '#1E1242' }}>
                <img src={OrgIcon} alt="Organization" className="w-8 h-8 filter brightness-0 invert" />
              </div>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>SECTION 1/6</p>
              <h1 className={`text-xl lg:text-2xl font-semibold lg:mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create your group to organize the event</h1>
            </div>

            {errors.general && (
              <div className={`border px-4 py-3 rounded-lg mb-6 ${darkMode ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {capabilities.userRole === 'admin' && (
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Event created under <span className="text-red-400">*</span>
                    </label>
                    <div className="flex space-x-6">
                      {['admin', 'organisation'].map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio" name="grp_type" value={type} checked={formData.grp_type === type} onChange={handleInputChange}
                            className={`w-4 h-4 text-indigo-600 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                          />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.grp_type === 'organisation' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Organization name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your organization name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-12
                          ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                          ${errors.name ? 'border-red-500' : ''}`
                        }
                        style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type of organization</label>
                      <div className="relative">
                        <select name="organisation_type" value={formData.organisation_type} onChange={handleInputChange}
                          className={`appearance-none w-full pr-10 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-12
                            ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                            ${errors.organisation_type ? 'border-red-500' : ''}
                            ${!formData.organisation_type ? (darkMode ? 'font-thin text-white opacity-80' : 'font-thin text-gray-500') : 'font-normal'}`
                          }
                          style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                        >
                          <option value="" disabled>Select your event category</option>
                          {['Private Limited', 'Public Limited', 'Partnership', 'Proprietorship', 'LLP', 'NGO', 'Educational', 'Healthcare', 'Non-profit', 'Trust', 'Society', 'Other'].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      {errors.organisation_type && <p className="text-red-500 text-sm mt-1">{errors.organisation_type}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Organisation email ID</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your organization email"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-12
                            ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                            ${errors.email ? 'border-red-500' : ''}`
                          }
                          style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Organisation contact</label>
                        <input type="tel" name="contact_no" value={formData.contact_no} onChange={handleInputChange} placeholder="Enter your contact number" maxLength="10"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-12
                            ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                            ${errors.contact_no ? 'border-red-500' : ''}`
                          }
                          style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                        />
                        {errors.contact_no && <p className="text-red-500 text-sm mt-1">{errors.contact_no}</p>}
                      </div>
                    </div>
                     <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Organisation address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your organisation address" rows="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[100px]
                          ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                          ${errors.address ? 'border-red-500' : ''}`
                        }
                        style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Do you have GST registration <span className="text-red-400">*</span>
                  </label>
                  <div className="flex space-x-6">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio" name="hasGst" value={option} checked={hasGst === option} onChange={handleGstChange}
                          className={`w-4 h-4 text-indigo-600 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasGst === 'Yes' && (
                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>GST IN</label>
                    <input
                      type="text" name="gst_no" value={formData.gst_no} onChange={handleInputChange} placeholder="Enter your GST number"
                      className={`w-full px-4 py-3 border rounded-lg h-12 focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}`}
                      style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                    />
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>PAN number</label>
                  <input type="text" name="pan_no" value={formData.pan_no} onChange={handleInputChange} placeholder="Enter your PAN number"
                    className={`w-full px-4 py-3 border rounded-lg h-12 focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${darkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}
                      ${errors.pan_no ? 'border-red-500' : ''}`
                    }
                    style={{ backgroundColor: darkMode ? '#212426' : 'white' }}
                  />
                  {errors.pan_no && <p className="text-red-500 text-sm mt-1">{errors.pan_no}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadArea label="ID proof" name="id_proof" />
                  <FileUploadArea label="Bank cheque" name="bank_check" />
                </div>

                {formData.grp_type === 'organisation' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadArea label="Company Certificate" name="company_certificate" />
                    <FileUploadArea label="Company Logo" name="company_logo" />
                  </div>
                )}
              </div>

              {/* RESPONSIVE: Button layout stacks on mobile and is row on sm+ screens */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
                <button type="button" onClick={() => navigate('/groups')} disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg transition-colors disabled:opacity-50 h-12 min-w-[120px] font-semibold"
                  style={{
                    backgroundColor: darkMode ? '#363A3F' : '#E5E7EB',
                    color: darkMode ? 'white' : '#374151',
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50 h-12 min-w-[120px] font-semibold"
                  style={{ backgroundColor: darkMode ? '#1E1242' : '#1E1242' }}
                >
                  {loading ? 'Creating...' : 'Add group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateGroup;
