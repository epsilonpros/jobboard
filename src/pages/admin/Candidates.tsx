import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, Search, Filter, Mail, Phone, Download, Globe, Linkedin as LinkedIn, GraduationCap, Calendar } from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';
import type { Candidate } from '../../types';

export default function AdminCandidates() {
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [availabilityFilter, setAvailabilityFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  const api = new ApiGeneric();

  React.useEffect(() => {
    fetchCandidates(1);
    setPage(1);
  }, [availabilityFilter]);

  const fetchCandidates = async (pageNumber: number, isLoadMore = false) => {
    try {
      api.page = pageNumber;
      api.rowsPerPage = 12;

      let url = '/api/candidates';
      if (availabilityFilter !== 'all') {
        url += `?available_for_hire=${availabilityFilter === 'available'}`;
      }

      const data = await api.getPaginate(url, 'page');

      if (isLoadMore) {
        setCandidates(prev => [...prev, ...data.member]);
      } else {
        setCandidates(data.member);
      }

      setHasMore(data.member.length === 12);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchCandidates(nextPage, true);
    setPage(nextPage);
  }, [page, loadingMore, hasMore]);

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

  const handleDownloadCV = async (candidate: Candidate) => {
    if (!candidate.resume_url) {
      toast.error('Aucun CV disponible');
      return;
    }

    try {
      window.open(candidate.resume_url, '_blank');
    } catch (error) {
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch =
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && candidate.available_for_hire) ||
        (availabilityFilter === 'unavailable' && !candidate.available_for_hire);
    return matchesSearch && matchesAvailability;
  });

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des candidats</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher un candidat..."
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
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Tous les candidats</option>
                  <option value="available">Disponibles</option>
                  <option value="unavailable">Non disponibles</option>
                </select>
              </div>
          )}
        </div>

        {/* Candidates List */}
        {loading && page === 1 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        ) : filteredCandidates.length === 0 ? (
            <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun candidat trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                              {candidate.avatar_url ? (
                                  <img
                                      src={candidate.avatar_url}
                                      alt={`${candidate.firstName} ${candidate.lastName}`}
                                      className="h-12 w-12 rounded-full object-cover"
                                  />
                              ) : (
                                  <User className="h-6 w-6 text-indigo-600" />
                              )}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </h3>
                              <p className="text-sm text-gray-500">{candidate.title}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              candidate.available_for_hire
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                      {candidate.available_for_hire ? 'Disponible' : 'Non disponible'}
                    </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          {candidate.preferred_location && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{candidate.preferred_location}</span>
                              </div>
                          )}
                          {candidate.willing_to_relocate && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>Prêt à déménager</span>
                              </div>
                          )}
                          {candidate.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{candidate.email}</span>
                              </div>
                          )}
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                            {skill}
                          </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{candidate.skills.length - 3}
                          </span>
                                )}
                              </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                          <div className="flex space-x-2">
                            {candidate.linkedin_url && (
                                <a
                                    href={candidate.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                  <LinkedIn className="h-5 w-5" />
                                </a>
                            )}
                            {candidate.portfolio_url && (
                                <a
                                    href={candidate.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                  <Globe className="h-5 w-5" />
                                </a>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {candidate.resume_url && (
                                <button
                                    onClick={() => handleDownloadCV(candidate)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  CV
                                </button>
                            )}
                            <a
                                // href={`mailto:${candidate.email}`}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Contacter
                            </a>
                          </div>
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
              {!hasMore && filteredCandidates.length > 0 && (
                  <div className="mt-8 text-center text-gray-500">
                    Vous avez atteint la fin de la liste
                  </div>
              )}
            </>
        )}
      </div>
  );
}