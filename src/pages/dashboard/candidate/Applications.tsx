import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchApplications } from '../../../store/slices/applicationsSlice';
import { Building2, Calendar, CheckCircle, XCircle, Clock, Search, Filter, MapPin, DollarSign, Briefcase, FileText, Download } from 'lucide-react';
import type { Application } from '../../../types';

export default function CandidateApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, hasMore } = useSelector((state: RootState) => state.applications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dispatch(fetchApplications({ page: 1 }));
    setPage(1);
  }, [dispatch, statusFilter]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await dispatch(fetchApplications({ page: nextPage, status: statusFilter !== 'all' ? statusFilter : undefined }));
    setPage(nextPage);
    setLoadingMore(false);
  }, [dispatch, page, loadingMore, hasMore, statusFilter]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, loadMore]);

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

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(application => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        application.job.title.toLowerCase().includes(searchLower) ||
        application.job.company.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Mes candidatures</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par poste ou entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="reviewing">En cours d'examen</option>
                <option value="accepted">Acceptées</option>
                <option value="rejected">Refusées</option>
              </select>
            </div>
          )}
        </div>

        {/* Applications List */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez à postuler pour suivre vos candidatures ici.
            </p>
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
          <>
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                          {application.job.company.logo_url ? (
                            <img
                              src={application.job.company.logo_url}
                              alt={application.job.company.name}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.job.title}
                          </h3>
                          <Link 
                            to={`/companies/${application.job.company?.['@id']?.split('/').pop()}`}
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            {application.job.company.name}
                          </Link>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1.5">{getStatusText(application.status)}</span>
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{application.job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {application.job.salaryMin && application.job.salaryMax
                            ? `${application.job.salaryMin.toLocaleString()} - ${application.job.salaryMax.toLocaleString()} $`
                            : 'Salaire non spécifié'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Postulé le {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="flex space-x-4">
                        {application.resume_url && (
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <Download className="h-4 w-4 mr-2" />
                            CV
                          </button>
                        )}
                        {application.coverLetter && (
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <FileText className="h-4 w-4 mr-2" />
                            Lettre de motivation
                          </button>
                        )}
                      </div>
                      <Link
                        to={`/jobs/${application.job.id}`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Voir l'offre
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            <div ref={observerTarget} className="mt-8 flex justify-center">
              {loadingMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              )}
            </div>

            {/* End of list message */}
            {!hasMore && filteredApplications.length > 0 && (
              <div className="mt-8 text-center text-gray-500">
                Vous avez atteint la fin de la liste
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}