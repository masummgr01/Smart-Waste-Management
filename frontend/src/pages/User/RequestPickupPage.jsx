import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPickupRequest } from '../../services/pickup.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const RequestPickupPage = () => {
  const [formData, setFormData] = useState({
    notes: '',
    image: null,
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error('Failed to get location. Please enable location services.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error('Please allow location access');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('location', JSON.stringify(location));
      formDataToSend.append('notes', formData.notes);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await createPickupRequest(formDataToSend);
      toast.success('Pickup request created successfully!');
      navigate(`/user/status/${response.pickupRequest._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create pickup request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Request Garbage Pickup</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          {location ? (
            <p className="text-sm text-gray-600">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          ) : (
            <p className="text-sm text-yellow-600">Getting your location...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            rows="4"
            className="input-field"
            placeholder="Any additional information about the pickup..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo (optional)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading || !location}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestPickupPage;

