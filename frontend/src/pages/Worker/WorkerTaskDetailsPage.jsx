import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkerTasks, updateTaskStatus } from '../../services/worker.js';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const WorkerTaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await getWorkerTasks();
      const foundTask = response.tasks.find((t) => t._id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        toast.error('Task not found');
        navigate('/worker/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/worker/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateTaskStatus(id, newStatus);
      toast.success('Task status updated!');
      fetchTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openMaps = () => {
    if (task?.pickupLocation?.coordinates) {
      const [lng, lat] = task.pickupLocation.coordinates;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate('/worker/dashboard')}
        className="text-primary-600 hover:underline mb-4"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Task Details</h1>

      <div className="card space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Task Information</h2>
          <p className="text-gray-600">
            <strong>Task ID:</strong> #{task.pickupId.slice(-6)}
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${STATUS_COLORS[task.status]}`}>
              {task.status}
            </span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">User Information</h3>
          <p className="text-gray-600">Name: {task.user.name}</p>
          {task.user.phone && (
            <p className="text-gray-600">Phone: {task.user.phone}</p>
          )}
        </div>

        {task.notes && (
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{task.notes}</p>
          </div>
        )}

        {task.imageUrl && (
          <div>
            <h3 className="font-semibold mb-2">Location Photo</h3>
            <img
              src={task.imageUrl}
              alt="Pickup location"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          {task.pickupLocation?.coordinates && (
            <>
              <p className="text-gray-600 mb-2">
                Latitude: {task.pickupLocation.coordinates[1].toFixed(6)}
              </p>
              <p className="text-gray-600 mb-2">
                Longitude: {task.pickupLocation.coordinates[0].toFixed(6)}
              </p>
              <button onClick={openMaps} className="btn-primary">
                Open in Maps
              </button>
            </>
          )}
        </div>

        {task.startTime && (
          <div>
            <h3 className="font-semibold mb-2">Timeline</h3>
            <p className="text-gray-600">
              Started: {new Date(task.startTime).toLocaleString()}
            </p>
            {task.endTime && (
              <p className="text-gray-600">
                Completed: {new Date(task.endTime).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Actions</h3>
          <div className="flex gap-4">
            {task.status === 'assigned' && (
              <button
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={updating}
                className="btn-primary"
              >
                {updating ? <LoadingSpinner size="sm" /> : 'Start Task'}
              </button>
            )}
            {task.status === 'in_progress' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating}
                className="btn-primary"
              >
                {updating ? <LoadingSpinner size="sm" /> : 'Mark as Completed'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskDetailsPage;




