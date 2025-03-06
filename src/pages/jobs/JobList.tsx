import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Clock, Briefcase, DollarSign, Filter, Calendar, ChevronRight, Globe, Users, Star } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchJobs, setFilters } from '../../store/slices/jobsSlice';
import type { Job } from '../../types';

export default function JobList() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, filters, hasMore } = useSelector((state: RootState) => state.jobs);
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dispatch(fetchJobs({ ...filters, page: 1 }));
    setPage(1);
  }, [dispatch, filters]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await dispatch(fetchJobs({ ...filters, page: nextPage }));
    setPage(nextPage);
    setLoadingMore(false);
  }, [dispatch, filters, page, loadingMore, hasMore]);

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

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const filteredJobs = React.useMemo(() => {
    return jobs?.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const displaySalary = (min?: number, max?: number) => {
    if(min && max) {
      return `${min.toLocaleString()} $ - ${max.toLocaleString()} $`;
    } else if(min) {
      return `À partir de ${min.toLocaleString()} $`;
    } else if(max) {
      return `Jusqu'à ${max.toLocaleString()} $`;
    }
    return 'Non spécifié';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-indigo-900/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trouvez votre prochain emploi
            </h1>
            <p className="mt-4 text-xl text-indigo-100">
              Découvrez les meilleures opportunités professionnelles
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher par titre, compétence ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-lg"
                  />
                  <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-6 py-4 bg-white border border-transparent rounded-xl text-base font-medium text-indigo-700 hover:bg-indigo-50 shadow-lg"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Tous les types</option>
                    <option value="full-time">CDI</option>
                    <option value="part-time">CDD</option>
                    <option value="contract">Freelance</option>
                    <option value="internship">Stage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Toutes les villes</option>
                    <option value="kinshasa">Kinshasa</option>
                    <option value="lubumbashi">Lubumbashi</option>
                    <option value="goma">Goma</option>
                    <option value="bukavu">Bukavu</option>
                    <option value="matadi">Matadi</option>
                    <option value="remote">Télétravail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire annuel
                  </label>
                  <select
                    value={filters.salary || ''}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Tous les salaires</option>
                    <option value="0-500000">0 - 500 000 $</option>
                    <option value="500000-1000000">500 000 - 1 000 000 $</option>
                    <option value="1000000-2000000">1 000 000 - 2 000 000 $</option>
                    <option value="2000000+">2 000 000+ $</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredJobs?.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-lg py-12 px-4">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
            <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs?.map((job: Job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                          {job.company.logo_url ? (
                            <img
                              src={job.company.logo_url}
                              alt={job.company.name}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                          </h3>
                          <Link
                            to={`/companies/${job.company.id}`}
                            className="text-sm text-gray-500 hover:text-indigo-600"
                          >
                            {job.company.name}
                          </Link>
                        </div>
                      </div>
                      {job.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{job.location} {job.remote && '(Télétravail)'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {job.type === 'full-time' ? 'CDI' : 
                           job.type === 'part-time' ? 'CDD' : 
                           job.type === 'contract' ? 'Freelance' : 'Stage'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{displaySalary(job.salaryMin, job.salaryMax)}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.createdAt as string).toLocaleDateString('fr-FR')}
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                        Voir l'offre
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            <div ref={observerTarget} className="mt-8 flex justify-center">
              {loadingMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              )}
            </div>
            
            {/* End of list message */}
            {!hasMore && filteredJobs.length > 0 && (
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