import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPickupRequests } from '../../services/pickup.js';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const UserDashboardPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchPickups();

    // Listen for real-time updates
    if (socket) {
      socket.on('pickupStatusUpdated', (data) => {
        setPickups((prev) =>
          prev.map((p) =>
            p._id === data.pickupId
              ? { ...p, status: data.newStatus }
              : p
          )
        );
        toast.success('Pickup status updated!');
      });
    }

    return () => {
      if (socket) {
        socket.off('pickupStatusUpdated');
      }
    };
  }, [socket]);

  const fetchPickups = async () => {
    try {
      const response = await getMyPickupRequests();
      setPickups(response.pickups);
    } catch (error) {
      toast.error('Failed to load pickup requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Pickup Requests</h1>
        <Link to="/user/request-pickup" className="btn-primary">
          Request New Pickup
        </Link>
      </div>

      {pickups.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No pickup requests yet.</p>
          <Link to="/user/request-pickup" className="btn-primary">
            Create Your First Request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {pickups.map((pickup) => (
            <div key={pickup._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Request #{pickup._id.slice(-6)}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Status:{' '}
                    <span
                      className={`px-2 py-1 rounded ${STATUS_COLORS[pickup.status]}`}
                    >
                      {pickup.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(pickup.createdAt).toLocaleDateString()}
                  </p>
                  {pickup.workerId && (
                    <p className="text-sm text-gray-600 mt-2">
                      Assigned to: {pickup.workerId.name}
                    </p>
                  )}
                </div>
                <Link
                  to={`/user/status/${pickup._id}`}
                  className="btn-secondary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;




