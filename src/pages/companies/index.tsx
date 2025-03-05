import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Search, Filter, Briefcase, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {ApiGeneric} from "../../api";

interface Company {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  industry: string;
  size: string;
  location: string;
  website: string | null;
  verified: boolean;
  jobsCount: number;
}

export default function Companies() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    industry: '',
    location: '',
    size: '',
    hasOpenings: false,
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    fetchCompanies();
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      const api = new ApiGeneric()

      // let query = supabase
      //   .from('companies')
      //   .select(`
      //     *,
      //     jobs!inner(id)
      //   `)
      //   .eq('verified', true);
      //
      // if (filters.industry) {
      //   query = query.eq('industry', filters.industry);
      // }
      // if (filters.location) {
      //   query = query.eq('location', filters.location);
      // }
      // if (filters.size) {
      //   query = query.eq('size', filters.size);
      // }
      //
      // const { data, error } = await query;
      // if (error) throw error;
      const data = await api.onSend('/api/companies?verified=true')
      setCompanies(data.member);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name.toLowerCase().includes(searchLower) ||
        company.description?.toLowerCase().includes(searchLower) ||
        company.industry?.toLowerCase().includes(searchLower)
      );
    }
    if (filters.hasOpenings && company.jobsCount === 0) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez les Entreprises qui Recrutent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez les meilleures entreprises de la RDC et trouvez votre prochain employeur
          </p>
        </div>

        {/* Recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur d'activité
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                  className="block w-full rounded-lg border-gray-300"
                >
                  <option value="">Tous les secteurs</option>
                  <option value="technology">Technologie</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Santé</option>
                  <option value="education">Éducation</option>
                  <option value="retail">Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="block w-full rounded-lg border-gray-300"
                >
                  <option value="">Toutes les provinces</option>
                  <option value="kinshasa">Kinshasa</option>
                  <option value="lubumbashi">Lubumbashi</option>
                  <option value="goma">Goma</option>
                  <option value="bukavu">Bukavu</option>
                  <option value="matadi">Matadi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille de l'entreprise
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                  className="block w-full rounded-lg border-gray-300"
                >
                  <option value="">Toutes les tailles</option>
                  <option value="1-10">1-10 employés</option>
                  <option value="11-50">11-50 employés</option>
                  <option value="51-200">51-200 employés</option>
                  <option value="201-500">201-500 employés</option>
                  <option value="501+">501+ employés</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasOpenings"
                  checked={filters.hasOpenings}
                  onChange={(e) => setFilters({ ...filters, hasOpenings: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="hasOpenings" className="ml-2 block text-sm text-gray-700">
                  Postes ouverts uniquement
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Liste des entreprises */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 rounded-xl shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="h-32 bg-gradient-to-br from-indigo-600 to-indigo-700 relative">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-lg">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-indigo-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-12">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    {company.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Vérifié
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm text-center mb-6 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {company.size} employés
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {company.jobsCount} offres d'emploi
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    <Link
                      to={`/companies/${company.id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                    >
                      Voir le profil
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}