import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPickupStatus } from '../../services/pickup.js';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const UserStatusPage = () => {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchPickupStatus();

    // Listen for real-time updates
    if (socket) {
      socket.on('pickupStatusUpdated', (data) => {
        if (data.pickupId === id) {
          setPickup((prev) => ({ ...prev, status: data.newStatus }));
          toast.success('Status updated!');
        }
      });

      socket.on('pickupAssigned', (data) => {
        if (data.pickupRequest._id === id) {
          setPickup(data.pickupRequest);
          toast.success('Worker assigned!');
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('pickupStatusUpdated');
        socket.off('pickupAssigned');
      }
    };
  }, [id, socket]);

  const fetchPickupStatus = async () => {
    try {
      const response = await getPickupStatus(id);
      setPickup(response.pickupRequest);
    } catch (error) {
      toast.error('Failed to load pickup status');
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

  if (!pickup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Pickup request not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Pickup Request Status</h1>

      <div className="card space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Request Details</h2>
          <p className="text-gray-600">
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${STATUS_COLORS[pickup.status]}`}>
              {pickup.status}
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Created:</strong> {new Date(pickup.createdAt).toLocaleString()}
          </p>
          {pickup.updatedAt && (
            <p className="text-gray-600">
              <strong>Last Updated:</strong> {new Date(pickup.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {pickup.notes && (
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{pickup.notes}</p>
          </div>
        )}

        {pickup.imageUrl && (
          <div>
            <h3 className="font-semibold mb-2">Photo</h3>
            <img
              src={pickup.imageUrl}
              alt="Pickup location"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )}

        {pickup.workerId && (
          <div>
            <h3 className="font-semibold mb-2">Assigned Worker</h3>
            <p className="text-gray-600">Name: {pickup.workerId.name}</p>
            {pickup.workerId.phone && (
              <p className="text-gray-600">Phone: {pickup.workerId.phone}</p>
            )}
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <p className="text-gray-600">
            Latitude: {pickup.location.coordinates[1].toFixed(6)}
          </p>
          <p className="text-gray-600">
            Longitude: {pickup.location.coordinates[0].toFixed(6)}
          </p>
          <a
            href={`https://www.google.com/maps?q=${pickup.location.coordinates[1]},${pickup.location.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline mt-2 inline-block"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserStatusPage;




