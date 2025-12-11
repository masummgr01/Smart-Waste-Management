import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPickups, getAnalytics } from '../../services/admin.js';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const AdminDashboardPage = () => {
  const [pickups, setPickups] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchData();

    // Listen for real-time updates
    if (socket) {
      socket.on('newPickupRequest', (data) => {
        setPickups((prev) => [data.pickupRequest, ...prev]);
        toast.success('New pickup request received!');
      });

      socket.on('pickupStatusUpdated', (data) => {
        setPickups((prev) =>
          prev.map((p) =>
            p._id === data.pickupId
              ? { ...p, status: data.newStatus }
              : p
          )
        );
        fetchAnalytics(); // Refresh analytics
      });
    }

    return () => {
      if (socket) {
        socket.off('newPickupRequest');
        socket.off('pickupStatusUpdated');
      }
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [pickupsRes, analyticsRes] = await Promise.all([
        getAllPickups(),
        getAnalytics(),
      ]);
      setPickups(pickupsRes.pickups);
      setAnalytics(analyticsRes.analytics);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.analytics);
    } catch (error) {
      console.error('Failed to refresh analytics');
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/map" className="btn-primary">
            View Map
          </Link>
          <Link to="/admin/analytics" className="btn-secondary">
            Analytics
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Pickups</h3>
            <p className="text-2xl font-bold">{analytics.totalPickups}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{analytics.completedPickups}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{analytics.pendingPickups}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Time</h3>
            <p className="text-2xl font-bold">{analytics.averageCompletionTime}</p>
          </div>
        </div>
      )}

      {/* Recent Pickups */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Pickup Requests</h2>
        {pickups.length === 0 ? (
          <p className="text-gray-600">No pickup requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">User</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Worker</th>
                  <th className="text-left py-2">Created</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pickups.slice(0, 10).map((pickup) => (
                  <tr key={pickup._id} className="border-b">
                    <td className="py-2">#{pickup._id.slice(-6)}</td>
                    <td className="py-2">
                      {pickup.userId?.name || pickup.userName || 'N/A'}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[pickup.status]}`}
                      >
                        {pickup.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {pickup.workerId?.name || pickup.workerName || 'Unassigned'}
                    </td>
                    <td className="py-2 text-sm text-gray-600">
                      {new Date(pickup.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      {pickup.status === 'pending' && (
                        <Link
                          to={`/admin/map?assign=${pickup._id}`}
                          className="text-primary-600 hover:underline"
                        >
                          Assign
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;




