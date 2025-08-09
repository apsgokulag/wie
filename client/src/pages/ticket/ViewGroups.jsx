import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 1. Import getUserGroupCapabilities instead of getGroups
import { getUserGroupCapabilities } from '../../services/ticketService';
import './ViewGroups.css';

const ViewGroups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [capabilities, setCapabilities] = useState(null); // State to hold user capabilities
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // 2. Fetch all necessary data when the component loads
    fetchData();
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clear location state to prevent message from reappearing on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 3. Call the more comprehensive API endpoint
      const data = await getUserGroupCapabilities();
      setGroups(data.userGroups || []);
      setCapabilities(data); // Store the capabilities, including the user's role
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch group data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if the user can create more groups
  const canCreateMore = () => {
    if (!capabilities) return false; // Don't show button until data is loaded

    if (capabilities.userRole === 'admin') {
      const hasAdminGroup = groups.some(g => g.grp_type === 'admin');
      const hasOrgGroup = groups.some(g => g.grp_type === 'organisation');
      // Return true (can create) if they are missing at least one of the two types
      return !(hasAdminGroup && hasOrgGroup);
    } 
    
    if (capabilities.userRole === 'organisation') {
      // Return true (can create) if they have fewer than 4 groups
      return groups.length < 4;
    }
    
    return false; // Default case
  };


  const handleViewDetails = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
  };

  const handleCreateNew = () => {
    navigate('/ticket/create-group');
  };
  const handleBack = () => {
    navigate(-1);
  };
  
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.contact_no.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || group.grp_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="view-groups-container">
      <div className="view-groups-header">
        <div className="header-content">
          <h1>Manage Groups</h1>
          {/* 4. Conditionally render the "Create New Group" button */}
          {canCreateMore() && (
            <button className="btn-create-new" onClick={handleCreateNew}>
              <span className="plus-icon">+</span>
              Create New Group
            </button>
          )}
        </div>
        <div className="header-actions">
            <button className="btn-back" onClick={handleBack}>
                <span className="back-icon">←</span>
                Back
            </button>
        </div>
        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
            <button className="retry-btn" onClick={fetchData}>Retry</button>
          </div>
        )}
      </div>

      <div className="groups-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Groups</option>
            <option value="admin">Admin Groups</option>
            <option value="organisation">Organisation Groups</option>
          </select>
        </div>
      </div>

      <div className="groups-stats">
        <div className="stat-card">
          <h3>{groups.length}</h3>
          <p>Total Groups</p>
        </div>
        {/* 5. Conditionally render the "Admin Groups" stat card for admins only */}
        {capabilities?.userRole === 'admin' && (
          <div className="stat-card">
            <h3>{groups.filter(g => g.grp_type === 'admin').length}</h3>
            <p>Admin Groups</p>
          </div>
        )}
        <div className="stat-card">
          <h3>{groups.filter(g => g.grp_type === 'organisation').length}</h3>
          <p>Organisation Groups</p>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="no-groups">
          <div className="no-groups-icon">📁</div>
          <h3>No groups found</h3>
          <p>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first group.'
            }
          </p>
          {/* Also check canCreateMore() here for the "Create First Group" button */}
          {!searchTerm && filterType === 'all' && canCreateMore() && (
            <button className="btn-create-first" onClick={handleCreateNew}>
              Create First Group
            </button>
          )}
        </div>
      ) : (
        <div className="groups-grid">
          {filteredGroups.map((group) => (
            <div key={group._id} className="group-card">
              <div className="group-header">
                <h3 className="group-name">{group.name}</h3>
                <span className={`group-type-badge ${group.grp_type}`}>
                  {group.grp_type === 'admin' ? 'Admin' : 'Organisation'}
                </span>
              </div>
              
              <div className="group-info">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{group.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contact:</span>
                  <span className="info-value">{group.contact_no}</span>
                </div>
                {group.organisation_type && (
                  <div className="info-item">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{group.organisation_type}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Created:</span>
                  <span className="info-value">{formatDate(group.createdAt)}</span>
                </div>
              </div>
              
              <div className="group-actions">
                <button 
                  className="btn-view-details"
                  onClick={() => handleViewDetails(group)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for group details */}
      {showModal && selectedGroup && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedGroup.name}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Group Type:</label>
                    <span className={`group-type-badge ${selectedGroup.grp_type}`}>
                      {selectedGroup.grp_type === 'admin' ? 'Admin Group' : 'Organisation Group'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedGroup.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact Number:</label>
                    <span>{selectedGroup.contact_no}</span>
                  </div>
                  <div className="detail-item">
                    <label>PAN Number:</label>
                    <span>{selectedGroup.pan_no}</span>
                  </div>
                  <div className="detail-item">
                    <label>ID Proof:</label>
                    {/* Assuming id_proof is a URL or filename */}
                    <span>{selectedGroup.id_proof}</span>
                  </div>
                  {selectedGroup.gst_no && (
                    <div className="detail-item">
                      <label>GST Number:</label>
                      <span>{selectedGroup.gst_no}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedGroup.grp_type === 'organisation' && (
                <div className="detail-section">
                  <h4>Organisation Details</h4>
                  <div className="detail-grid">
                    <div className="detail-item full-width">
                      <label>Address:</label>
                      <span>{selectedGroup.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Organisation Type:</label>
                      <span>{selectedGroup.organisation_type}</span>
                    </div>
                    {selectedGroup.company_certificate && (
                      <div className="detail-item">
                        <label>Company Certificate:</label>
                        <span>{selectedGroup.company_certificate}</span>
                      </div>
                    )}
                    {selectedGroup.company_logo && (
                      <div className="detail-item">
                        <label>Company Logo:</label>
                        <a href={selectedGroup.company_logo} target="_blank" rel="noopener noreferrer">
                          View Logo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedGroup.bank_check && (
                <div className="detail-section">
                  <h4>Banking Information</h4>
                  <div className="detail-item">
                    <label>Bank Check Details:</label>
                    <span>{selectedGroup.bank_check}</span>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>System Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Created At:</label>
                    <span>{formatDate(selectedGroup.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(selectedGroup.updatedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Group ID:</label>
                    <span className="group-id">{selectedGroup._id}</span>
                  </div>
                   {selectedGroup.userId && (
                    <div className="detail-item">
                       <label>Created By:</label>
                       <span>
                         {typeof selectedGroup.userId === 'object' && selectedGroup.userId !== null ? 
                           `${selectedGroup.userId.name} (${selectedGroup.userId.email})` : 
                           selectedGroup.userId
                         }
                       </span>
                     </div>
                   )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGroups;