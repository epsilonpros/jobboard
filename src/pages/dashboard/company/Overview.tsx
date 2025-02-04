import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';

export default function CompanyOverview() {
  const stats = [
    { name: 'Offres actives', value: '12', icon: Briefcase, change: '+2%', changeType: 'increase' },
    { name: 'Candidatures reçues', value: '48', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Taux d\'entretiens', value: '24%', icon: TrendingUp, change: '+4%', changeType: 'increase' },
    { name: 'Délai moyen de recrutement', value: '18 jours', icon: Clock, change: '-2 jours', changeType: 'decrease' },
  ];

  const recentActivity = [
    {
      type: 'application',
      candidate: 'Jean Dupont',
      position: 'Senior Developer',
      date: '2h ago'
    },
    {
      type: 'interview',
      candidate: 'Marie Martin',
      position: 'Product Manager',
      date: '1d ago'
    },
    {
      type: 'hire',
      candidate: 'Pierre Durand',
      position: 'UX Designer',
      date: '2d ago'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
      
      {/* Stats Grid */}
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
        <h2 className="text-lg font-medium text-gray-900">Activité récente</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'application' ? 'bg-blue-100' :
                      activity.type === 'interview' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'application' && <Users className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'interview' && <Clock className="h-5 w-5 text-green-600" />}
                      {activity.type === 'hire' && <Briefcase className="h-5 w-5 text-purple-600" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'application' && `Nouvelle candidature de ${activity.candidate}`}
                      {activity.type === 'interview' && `Entretien programmé avec ${activity.candidate}`}
                      {activity.type === 'hire' && `${activity.candidate} a été recruté(e)`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.position}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Offres actives</h2>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((job) => (
            <div key={job} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Senior Developer</h3>
                  <div className="mt-1 flex items-center">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-500">12 candidatures</span>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}