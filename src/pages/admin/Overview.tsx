import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Users, Briefcase, TrendingUp, Building2, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const stats = [
    { name: 'Utilisateurs', value: '2,847', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Offres actives', value: '482', icon: Briefcase, change: '+8%', changeType: 'increase' },
    { name: 'Entreprises', value: '156', icon: Building2, change: '+5%', changeType: 'increase' },
    { name: 'Taux de conversion', value: '24.3%', icon: TrendingUp, change: '+2.5%', changeType: 'increase' },
  ];

  const recentActivities = [
    { type: 'company_verified', company: 'Tech Corp', time: '2h ago' },
    { type: 'job_reported', company: 'StartUp Inc', job: 'Senior Developer', time: '4h ago' },
    { type: 'user_joined', user: 'John Doe', role: 'candidate', time: '6h ago' },
    { type: 'company_joined', company: 'Innovation Labs', time: '8h ago' },
  ];

  const pendingVerifications = [
    { id: 1, name: 'Tech Corp', type: 'company', date: '2 jours', status: 'pending' },
    { id: 2, name: 'StartUp Inc', type: 'company', date: '3 jours', status: 'pending' },
    { id: 3, name: 'Dev Agency', type: 'company', date: '4 jours', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord administrateur</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'company_verified' ? 'bg-green-100' :
                        activity.type === 'job_reported' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {activity.type === 'company_verified' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {activity.type === 'job_reported' && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        {activity.type === 'user_joined' && (
                          <Users className="h-5 w-5 text-blue-600" />
                        )}
                        {activity.type === 'company_joined' && (
                          <Building2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'company_verified' && `Entreprise vérifiée : ${activity.company}`}
                          {activity.type === 'job_reported' && 
                            `Offre signalée : ${activity.job} chez ${activity.company}`}
                          {activity.type === 'user_joined' && 
                            `Nouveau ${activity.role === 'candidate' ? 'candidat' : 'recruteur'} : ${activity.user}`}
                          {activity.type === 'company_joined' && 
                            `Nouvelle entreprise : ${activity.company}`}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vérifications en attente</h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {pendingVerifications.map((verification) => (
                  <li key={verification.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{verification.name}</p>
                          <p className="text-sm text-gray-500">En attente depuis {verification.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                          Vérifier
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow transition-all group"
            >
              <Users className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Gérer les utilisateurs</h3>
              <p className="mt-1 text-sm text-gray-500">Voir et gérer tous les utilisateurs</p>
            </Link>
            <Link
              to="/admin/companies"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow transition-all group"
            >
              <Building2 className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Gérer les entreprises</h3>
              <p className="mt-1 text-sm text-gray-500">Vérifier et gérer les entreprises</p>
            </Link>
            <Link
              to="/admin/jobs"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow transition-all group"
            >
              <Briefcase className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Gérer les offres</h3>
              <p className="mt-1 text-sm text-gray-500">Modérer les offres d'emploi</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}