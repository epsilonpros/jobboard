import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchApplications } from '../../../store/slices/applicationsSlice';
import { Building2, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Application } from '../../../types';

export default function CandidateApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector((state: RootState) => state.applications);

  React.useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'reviewing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      case 'reviewing':
        return 'En cours d\'examen';
      default:
        return 'En attente';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Mes candidatures</h1>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez à postuler pour suivre vos candidatures ici.</p>
            <div className="mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Parcourir les offres
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(application.status)}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {application.job.title}
                          </h4>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Building2 className="flex-shrink-0 mr-1.5 h-5 w-5" />
                            <p>{application.job.company.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : application.status === 'reviewing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                          Postulé le {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Link
                          to={`/jobs/${application.job.id}`}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Voir l'offre
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}