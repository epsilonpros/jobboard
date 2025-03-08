import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, MoreVertical, Search, Filter, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchCompanyJobs, deleteJob } from '../../store/slices/jobsSlice';
import type { Job } from '../../types';
import toast from 'react-hot-toast';

export default function JobManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, loading } = useSelector((state: RootState) => state.jobs);
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchCompanyJobs());
  }, [dispatch]);

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        setSelectedJob(null);
      } catch (error) {
        // Error is handled by the slice
      }
    }
  };

  const handleViewApplications = (jobId: string) => {
    navigate(`/dashboard/applications?job=${jobId}`);
  };

  const filteredJobs = React.useMemo(() => {
    return jobs?.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des offres</h1>
        <Link
          to="/jobs/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Publier une nouvelle offre d'emploi
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
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
          <div className="mt-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiées</option>
              <option value="draft">Brouillons</option>
              <option value="closed">Fermées</option>
            </select>
          </div>
        )}
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredJobs?.length === 0 ? (
        <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle offre d'emploi.</p>
          <div className="mt-6">
            <Link
              to="/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Publier une nouvelle offre d'emploi
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="">
            {/* <div className="overflow-x-auto"> */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails du poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidatures
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs?.map((job: Job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location} {job.remote && '(Remote)'}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salaryMin && job.salaryMax
                              ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                              : job.salaryMin
                              ? `${job.salaryMin.toLocaleString()}+`
                              : job.salaryMax
                              ? `Jusqu'à ${job.salaryMax.toLocaleString()}`
                              : 'Non spécifié'
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(job.status)
                      }`}>
                        {job.status === 'published' ? 'Publié' : job.status === 'draft' ? 'Brouillon' : 'Fermé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewApplications(job.id as string)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicationsCount || 0} candidatures
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {job.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Publié le {new Date(job.createdAt as string).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expire le {new Date(job.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id as string)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {selectedJob === job.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1" role="menu">
                              <Link
                                to={`/jobs/${job.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                Voir
                              </Link>
                              <Link
                                to={`/jobs/${job.id}/edit`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit2 className="h-4 w-4 mr-3" />
                                Modifier
                              </Link>
                              {job.applicationsCount === 0 && <button
                                onClick={() => handleDeleteJob(job.id as string)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Supprimer
                              </button>}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}