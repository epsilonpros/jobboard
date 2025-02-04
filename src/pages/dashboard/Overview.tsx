import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';

export default function Overview() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isCompany = user?.role === 'company';

  const stats = isCompany
    ? [
        { name: 'Active Jobs', value: '12', icon: Briefcase, change: '+2%', changeType: 'increase' },
        { name: 'Total Applications', value: '48', icon: Users, change: '+12%', changeType: 'increase' },
        { name: 'Interview Rate', value: '24%', icon: TrendingUp, change: '+4%', changeType: 'increase' },
        { name: 'Avg. Time to Hire', value: '18 days', icon: Clock, change: '-2 days', changeType: 'decrease' },
      ]
    : [
        { name: 'Applications', value: '8', icon: Briefcase, change: '+2', changeType: 'increase' },
        { name: 'Interviews', value: '3', icon: Users, change: '+1', changeType: 'increase' },
        { name: 'Profile Views', value: '124', icon: TrendingUp, change: '+12%', changeType: 'increase' },
        { name: 'Saved Jobs', value: '15', icon: Clock, change: '+3', changeType: 'increase' },
      ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
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
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {isCompany ? 'New application received' : 'Applied to Senior Developer position'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isCompany ? 'John Doe applied for Senior Developer position' : 'at Tech Corp'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">2h ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}