import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { getGroups } from '../../services/ticketService';
import GroupSelectionModal from '../../components/modals/GroupSelectionModal';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
      navigate('/login');
    } catch (error) {
      alert('Logout failed. Please try again.');
    }
  };

  const handleCreateEvent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const groupsResponse = await getGroups();
      console.log('Groups response:', groupsResponse); // Debug log
      
      // Since your API returns the array directly, not wrapped in a data property
      const groupsArray = Array.isArray(groupsResponse) ? groupsResponse : groupsResponse.data || [];
      
      setGroups(groupsArray);

      if (groupsArray.length === 0) {
        // No groups found - redirect to create group
        navigate('/ticket/create-group');
      } else if (groupsArray.length === 1) {
        // Only one group - directly navigate to create event
        const group = groupsArray[0];
        navigate(`/ticket/create-event/${group._id}`);
      } else {
        // Multiple groups - show selection modal
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking groups:', error);
      alert('Error fetching groups. Please try again.');
      // Optionally redirect to create group on error
      // navigate('/ticket/create-group');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = (selectedGroup) => {
    setIsModalOpen(false);
    navigate(`/ticket/create-event/${selectedGroup._id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
        Welcome {user?.name || 'Guest'} 👋
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        {user ? 'Explore your profile and settings.' : 'Please login or register to get started.'}
      </p>
      
      <div className="p-6">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {!user && (
          <>
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <Link
            to="/profile"
            className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Profile
          </Link>
        )}

        {user && (
          <button
            onClick={handleCreateEvent}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Checking Groups...' : 'Create Event'}
          </button>
        )}

        {user && (
          <Link
            to="/ticket/groups"
            className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            View Groups
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin/dashboard"
            className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Group Selection Modal */}
      <GroupSelectionModal
        groups={groups}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectGroup={handleSelectGroup}
      />
    </div>
  );
};

export default HomePage;
