import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';

export default function CandidateOverview() {
  const stats = [
    { name: 'Candidatures', value: '8', icon: Briefcase },
    { name: 'Entretiens', value: '3', icon: Users },
    { name: 'Vues du profil', value: '124', icon: TrendingUp},
    { name: 'Offres vues', value: '15', icon: Clock },
  ];

  const recentActivity = [
    {
      type: 'application',
      company: 'Tech Corp',
      position: 'Senior Developer',
      date: 'il y a 2 heures',
      status: 'pending'
    },
    {
      type: 'interview',
      company: 'Innovate Inc',
      position: 'Full Stack Developer',
      date: 'il y a  1 jour',
      status: 'scheduled'
    },
    {
      type: 'view',
      company: 'StartUp Labs',
      date: 'il y a 2 jours'
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
                      activity.type === 'interview' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Briefcase className={`h-5 w-5 ${
                        activity.type === 'application' ? 'text-blue-600' :
                        activity.type === 'interview' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'application' && `Candidature envoyée pour ${activity.position}`}
                      {activity.type === 'interview' && `Entretien programmé pour ${activity.position}`}
                      {activity.type === 'view' && 'Votre profil a été consulté'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.company}
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

      {/* Recommended Jobs */}
      {/*<div className="mt-8">*/}
      {/*  <h2 className="text-lg font-medium text-gray-900">Offres recommandées</h2>*/}
      {/*  <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">*/}
      {/*    {[1, 2, 3].map((job) => (*/}
      {/*      <div key={job} className="bg-white shadow rounded-lg p-6">*/}
      {/*        <div className="flex items-center justify-between">*/}
      {/*          <div className="flex items-center">*/}
      {/*            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">*/}
      {/*              <Briefcase className="h-6 w-6 text-gray-600" />*/}
      {/*            </div>*/}
      {/*            <div className="ml-4">*/}
      {/*              <h3 className="text-sm font-medium text-gray-900">Senior Developer</h3>*/}
      {/*              <p className="text-sm text-gray-500">Tech Corp</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">*/}
      {/*            Voir l'offre*/}
      {/*          </button>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}