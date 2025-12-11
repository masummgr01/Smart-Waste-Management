import { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/admin.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics(period);
      setAnalytics(response.analytics);
    } catch (error) {
      toast.error('Failed to load analytics');
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
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input-field w-auto"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {analytics && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Pickups</h3>
              <p className="text-3xl font-bold">{analytics.totalPickups}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.completedPickups}</p>
              <p className="text-sm text-gray-600 mt-1">
                {analytics.totalPickups > 0
                  ? Math.round((analytics.completedPickups / analytics.totalPickups) * 100)
                  : 0}% completion rate
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.pendingPickups}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Completion Time</h3>
              <p className="text-3xl font-bold">{analytics.averageCompletionTime}</p>
            </div>
          </div>

          {/* Worker Performance */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Worker Performance</h2>
            {analytics.workerPerformance && analytics.workerPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Worker Name</th>
                      <th className="text-left py-2">Completed Tasks</th>
                      <th className="text-left py-2">Average Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.workerPerformance.map((worker, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{worker.name}</td>
                        <td className="py-2">{worker.completed}</td>
                        <td className="py-2">{worker.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No worker performance data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;




