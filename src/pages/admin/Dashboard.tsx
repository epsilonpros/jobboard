import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Users, Briefcase, TrendingUp, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '2,847', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Active Jobs', value: '482', icon: Briefcase, change: '+8%', changeType: 'increase' },
    { name: 'Companies', value: '156', icon: Building2, change: '+5%', changeType: 'increase' },
    { name: 'Conversion Rate', value: '24.3%', icon: TrendingUp, change: '+2.5%', changeType: 'increase' },
  ];

  const recentActivities = [
    { type: 'company_verified', company: 'Tech Corp', time: '2h ago' },
    { type: 'job_reported', company: 'StartUp Inc', job: 'Senior Developer', time: '4h ago' },
    { type: 'user_joined', user: 'John Doe', role: 'candidate', time: '6h ago' },
    { type: 'company_joined', company: 'Innovation Labs', time: '8h ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow rounded-lg divide-y divide-gray-200">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === 'company_verified'
                      ? 'bg-green-100'
                      : activity.type === 'job_reported'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}>
                    {activity.type === 'company_verified' && (
                      <Building2 className="h-5 w-5 text-green-600" />
                    )}
                    {activity.type === 'job_reported' && (
                      <Briefcase className="h-5 w-5 text-red-600" />
                    )}
                    {activity.type === 'user_joined' && (
                      <Users className="h-5 w-5 text-blue-600" />
                    )}
                    {activity.type === 'company_joined' && (
                      <Building2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'company_verified' && `Verified ${activity.company}`}
                    {activity.type === 'job_reported' && 
                      `Job reported: ${activity.job} at ${activity.company}`}
                    {activity.type === 'user_joined' && 
                      `New ${activity.role}: ${activity.user}`}
                    {activity.type === 'company_joined' && 
                      `New company registered: ${activity.company}`}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Pending Verifications</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((company) => (
                <div key={company} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Company Name {company}</h3>
                      <p className="text-sm text-gray-500">Registered 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Verify
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}