import React from 'react';
import { Briefcase, MapPin, Building2, Star, Search, Filter, DollarSign } from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';
import type { Job } from '../../types';

export default function AdminJobs() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const api = new ApiGeneric();

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.onSend('/api/jobs');
      setJobs(data.member);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (jobId: string, featured: boolean) => {
    try {
      await api.onSend(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        data: { featured },
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });

      toast.success(featured ? 'Offre mise en avant' : 'Offre retirée des mises en avant');
      fetchJobs();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleUpdateStatus = async (jobId: string, status: 'published' | 'draft' | 'closed') => {
    try {
      await api.onSend(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        data: { status },
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });

      toast.success('Statut mis à jour');
      fetchJobs();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des offres d'emploi</h1>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une offre..."
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
              <option value="all">Toutes les offres</option>
              <option value="published">Publiées</option>
              <option value="draft">Brouillons</option>
              <option value="closed">Fermées</option>
            </select>
          </div>
        )}
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <li key={job.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        {job.featured && (
                          <Star className="ml-2 h-5 w-5 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Building2 className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        <p>{job.company?.name}</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        <p>{job.location} {job.remote && '(Télétravail)'}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex space-x-4">
                        <select
                          value={job.status}
                          onChange={(e) => handleUpdateStatus(job.id as string, e.target.value as 'published' | 'draft' | 'closed')}
                          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                          <option value="published">Publiée</option>
                          <option value="draft">Brouillon</option>
                          <option value="closed">Fermée</option>
                        </select>
                        <button
                          onClick={() => handleToggleFeatured(job.id as string, !job.featured)}
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                            job.featured
                              ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${job.featured ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}