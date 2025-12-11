import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkerTasks } from '../../services/worker.js';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { STATUS_COLORS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const WorkerDashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchTasks();

    // Listen for real-time updates
    if (socket) {
      socket.on('pickupAssigned', (data) => {
        fetchTasks(); // Refresh tasks when new assignment comes
        toast.success('New task assigned!');
      });
    }

    return () => {
      if (socket) {
        socket.off('pickupAssigned');
      }
    };
  }, [socket, filter]);

  const fetchTasks = async () => {
    try {
      const response = await getWorkerTasks(filter);
      setTasks(response.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
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

  const pendingTasks = tasks.filter((t) => t.status === 'assigned');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded ${!filter ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded ${filter === 'assigned' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Assigned
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded ${filter === 'in_progress' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned</h3>
          <p className="text-2xl font-bold text-blue-600">{pendingTasks.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">In Progress</h3>
          <p className="text-2xl font-bold text-purple-600">{inProgressTasks.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Task #{task.pickupId.slice(-6)}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-1 rounded ${STATUS_COLORS[task.status]}`}>
                      {task.status}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>User:</strong> {task.user.name}
                  </p>
                  {task.user.phone && (
                    <p className="text-gray-600 mb-2">
                      <strong>Phone:</strong> {task.user.phone}
                    </p>
                  )}
                  {task.startTime && (
                    <p className="text-sm text-gray-500">
                      Started: {new Date(task.startTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <Link
                  to={`/worker/task/${task._id}`}
                  className="btn-primary"
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

export default WorkerDashboardPage;




