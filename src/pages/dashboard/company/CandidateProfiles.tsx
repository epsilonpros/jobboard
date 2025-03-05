import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { User, MapPin, Briefcase, GraduationCap, Globe, Github, Linkedin, Download, Mail } from 'lucide-react';
import type { Candidate } from '../../../types';
import {ApiGeneric} from "../../../api";


const api = new ApiGeneric()
api.rowsPerPage = 12
api.page = 3
export default function CandidateProfiles() {
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    available: false,
    willing_to_relocate: false,
    location: '',
    skills: '',
  });

  React.useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const fetchCandidates = async () => {
    try {
      const data = await api.getPaginate('/api/candidates','page')
      // let query = supabase
      //   .from('candidates')
      //   .select(`
      //     *,
      //     profiles (email),
      //     experiences (
      //       id,
      //       company,
      //       title,
      //       start_date,
      //       end_date,
      //       current
      //     ),
      //     education (
      //       id,
      //       school,
      //       degree,
      //       field,
      //       start_date,
      //       end_date
      //     ),
      //     candidate_skills (
      //       skill_id,
      //       skills (name)
      //     )
      //   `);
      //
      // if (filters.available) {
      //   query = query.eq('available_for_hire', true);
      // }
      //
      // if (filters.willing_to_relocate) {
      //   query = query.eq('willing_to_relocate', true);
      // }
      //
      // if (filters.location) {
      //   query = query.ilike('preferred_location', `%${filters.location}%`);
      // }
      //
      // const { data, error } = await query;

      // if (error) throw error;
      setCandidates(data.member);
    } catch (error) {
      console.error('Erreur lors du chargement des candidats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestExperience = (experiences: any[]) => {
    if (!experiences?.length) return null;
    return experiences.sort((a, b) => {
      if (a.current) return -1;
      if (b.current) return 1;
      return new Date(b.end_date || '').getTime() - new Date(a.end_date || '').getTime();
    })[0];
  };

  const getLatestEducation = (education: any[]) => {
    if (!education?.length) return null;
    return education.sort((a, b) => 
      new Date(b.end_date || '').getTime() - new Date(a.end_date || '').getTime()
    )[0];
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profils des Candidats</h1>
        <p className="mt-2 text-gray-600">
          Découvrez les talents disponibles et trouvez les meilleurs profils pour vos postes.
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Toutes les provinces</option>
              <option value="kinshasa">Kinshasa</option>
              <option value="lubumbashi">Lubumbashi</option>
              <option value="goma">Goma</option>
              <option value="bukavu">Bukavu</option>
              <option value="likasi">Likasi</option>
              <option value="kolwezi">Kolwezi</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={filters.available}
              onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
              Disponibles uniquement
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="relocate"
              checked={filters.willing_to_relocate}
              onChange={(e) => setFilters({ ...filters, willing_to_relocate: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="relocate" className="ml-2 block text-sm text-gray-700">
              Prêts à déménager
            </label>
          </div>
        </div>
      </div>

      {/* Liste des candidats */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun candidat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => {
            const latestExperience = getLatestExperience(candidate.experience);
            const latestEducation = getLatestEducation(candidate.education);

            return (
              <div key={candidate.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
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
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{candidate.title}</p>
                      </div>
                    </div>
                    {candidate.availableForHire && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    )}
                  </div>

                  {latestExperience && (
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>
                        {latestExperience.title} chez {latestExperience.company}
                        {latestExperience.current && " (Actuel)"}
                      </span>
                    </div>
                  )}

                  {latestEducation && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span>
                        {latestEducation.degree} en {latestEducation.field}
                      </span>
                    </div>
                  )}

                  {candidate.preferredLocation && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{candidate.preferredLocation}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.candidateSkills?.slice(0, 3).map((skill: any) => (
                      <span
                        key={skill.skill_id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {candidate.candidate_skills?.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{candidate.candidate_skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {candidate.linkedin_url && (
                        <a
                          href={candidate.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Linkedin className="h-5 w-5" />
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
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          CV
                        </button>
                      )}
                      <Link
                        // to={`/dashboard/messaging?candidate=${candidate.id}`}
                          to="#"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Contacter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}