import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getAllPickups, getAllWorkers, assignPickupToWorker } from '../../services/admin.js';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const AdminMapPage = () => {
  const [pickups, setPickups] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pickupsRes, workersRes] = await Promise.all([
        getAllPickups(),
        getAllWorkers(),
      ]);
      setPickups(pickupsRes.pickups);
      setWorkers(workersRes.workers);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (workerId) => {
    try {
      await assignPickupToWorker(selectedPickup._id, workerId);
      toast.success('Pickup assigned successfully!');
      setShowAssignModal(false);
      setSelectedPickup(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign pickup');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const defaultCenter = [28.6139, 77.2090]; // Default to Delhi, India

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pickup Requests Map</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card" style={{ height: '600px' }}>
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {pickups.map((pickup) => (
                <Marker
                  key={pickup._id}
                  position={[
                    pickup.location.coordinates[1],
                    pickup.location.coordinates[0],
                  ]}
                  eventHandlers={{
                    click: () => {
                      setSelectedPickup(pickup);
                      if (pickup.status === 'pending') {
                        setShowAssignModal(true);
                      }
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <p className="font-semibold">Request #{pickup._id.slice(-6)}</p>
                      <p className="text-sm">Status: {pickup.status}</p>
                      <p className="text-sm">User: {pickup.userId?.name || 'N/A'}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pickups
                .filter((p) => p.status === 'pending')
                .map((pickup) => (
                  <div
                    key={pickup._id}
                    className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedPickup(pickup);
                      setShowAssignModal(true);
                    }}
                  >
                    <p className="font-semibold">#{pickup._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      {pickup.userId?.name || 'Unknown User'}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedPickup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Assign Worker</h2>
            <p className="text-gray-600 mb-4">
              Assign pickup request #{selectedPickup._id.slice(-6)} to a worker
            </p>
            <div className="space-y-2 mb-4">
              {workers.map((worker) => (
                <button
                  key={worker._id}
                  onClick={() => handleAssign(worker._id)}
                  className="w-full text-left p-3 border rounded hover:bg-gray-50"
                >
                  <p className="font-semibold">{worker.name}</p>
                  <p className="text-sm text-gray-600">{worker.email}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedPickup(null);
              }}
              className="btn-secondary w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMapPage;




