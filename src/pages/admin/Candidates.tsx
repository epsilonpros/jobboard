import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, Search, Filter, Mail, Phone, Download } from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';
import type { Candidate } from '../../types';

export default function AdminCandidates() {
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [availabilityFilter, setAvailabilityFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const api = new ApiGeneric();

  React.useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await api.onSend('/api/candidates');
      setCandidates(data.member);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? (
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <li key={candidate.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {candidate.avatar_url ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={candidate.avatar_url}
                            alt={`${candidate.firstName} ${candidate.lastName}`}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{candidate.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {candidate.resume_url && (
                        <button
                          onClick={() => handleDownloadCV(candidate)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          CV
                        </button>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        candidate.available_for_hire
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {candidate.available_for_hire ? 'Disponible' : 'Non disponible'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {candidate.preferred_location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        <p>{candidate.preferred_location}</p>
                      </div>
                    )}
                    {candidate.willing_to_relocate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        <p>Prêt à déménager</p>
                      </div>
                    )}
                  </div>
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}