import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchApplications } from '../../../store/slices/applicationsSlice';
import { User, Calendar, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import type { Application } from '../../../types';

export default function CompanyApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector((state: RootState) => state.applications);

  React.useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    // Implement status update logic
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Candidatures reçues</h1>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature reçue</h3>
            <p className="mt-1 text-sm text-gray-500">Les candidatures apparaîtront ici une fois que vous recevrez des postulations.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {application.candidate?.first_name} {application.candidate?.last_name}
                          </h4>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {application.candidate?.email}
                            </span>
                            {application.candidate?.phone && (
                              <span className="flex items-center">
                                <Phone className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {application.candidate?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value as Application['status'])}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">En attente</option>
                          <option value="reviewing">En cours d'examen</option>
                          <option value="accepted">Acceptée</option>
                          <option value="rejected">Refusée</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-900 font-medium">
                        Candidature pour : {application.job.title}
                      </div>
                      {application.cover_letter && (
                        <div className="mt-2 text-sm text-gray-700">
                          <div className="bg-gray-50 p-4 rounded-md">
                            {application.cover_letter}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        Reçue le {new Date(application.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => {/* Implement CV download */}}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Télécharger le CV
                        </button>
                        <Link
                          to={`/dashboard/messaging?candidate=${application.candidate_id}`}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Contacter
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