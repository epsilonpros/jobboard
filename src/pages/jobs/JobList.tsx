import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Clock, Briefcase, DollarSign, Filter } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchJobs, setFilters } from '../../store/slices/jobsSlice';
import type { Job } from '../../types';

export default function JobList() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, filters } = useSelector((state: RootState) => state.jobs);
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Non spécifié';
    if (!max) return `${min.toLocaleString()}`;
    if (!min) return `Jusqu'à ${max.toLocaleString()} FC`;
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des offres d'emploi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Type de contrat</option>
              <option value="full-time">CDI</option>
              <option value="part-time">CDD</option>
              <option value="contract">Freelance</option>
              <option value="internship">Stage</option>
            </select>

            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Province</option>
              <option value="kinshasa">Kinshasa</option>
              <option value="lubumbashi">Lubumbashi</option>
              <option value="goma">Goma</option>
              <option value="bukavu">Bukavu</option>
              <option value="matadi">Matadi</option>
              <option value="remote">Télétravail</option>
            </select>

            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.salary || ''}
              onChange={(e) => handleFilterChange('salary', e.target.value)}
            >
              <option value="">Salaire ($)</option>
              <option value="0-500000">0 - 500 000 $</option>
              <option value="500000-1000000">500 000 - 1 000 000 $</option>
              <option value="1000000-2000000">1 000 000 - 2 000 000 $</option>
              <option value="2000000+">2 000 000+ $</option>
            </select>

            <button
              onClick={() => dispatch(setFilters({}))}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Liste des offres */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job: Job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  {job.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Mise en avant
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-2" />
                    {job.company.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location} {job.remote && '(Télétravail)'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {job.type === 'full-time' ? 'CDI' : 
                     job.type === 'part-time' ? 'CDD' : 
                     job.type === 'contract' ? 'Freelance' : 'Stage'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Voir l'offre
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}