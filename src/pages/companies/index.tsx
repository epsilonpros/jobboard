import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, MapPin, Globe, Users, Briefcase, Filter, ChevronRight, Star, ExternalLink, Mail } from 'lucide-react';
import { ApiGeneric } from "../../api";
import { AdvancedImage } from '@cloudinary/react';
import {getCloudinaryImage} from "../../lib/utils.ts";

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
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    industry: '',
    location: '',
    size: '',
    hasOpenings: false,
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  const fetchCompanies = async (pageNumber: number, isLoadMore = false) => {
    try {
      const api = new ApiGeneric();
      api.page = pageNumber;
      api.rowsPerPage = 12;

      const data = await api.onSend('/api/companies?verified=true');
      
      if (isLoadMore) {
        setCompanies(prev => [...prev, ...data.member]);
      } else {
        setCompanies(data.member);
      }

      setHasMore(data.member.length === 12);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchCompanies(1);
    setPage(1);
  }, [filters]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchCompanies(nextPage, true);
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
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-indigo-700 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-indigo-900/30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Découvrez les Meilleures Entreprises
            </h1>
            <p className="mt-4 text-xl text-indigo-100">
              Explorez les entreprises qui recrutent et trouvez votre futur employeur
            </p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise par nom, secteur..."
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
                    Secteur d'activité
                  </label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'entreprise
                  </label>
                  <select
                    value={filters.size}
                    onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Toutes les tailles</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-500">201-500 employés</option>
                    <option value="501+">501+ employés</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 rounded-xl shadow-sm">
            <Building2 className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune entreprise trouvée</h3>
            <p className="mt-2 text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-indigo-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute -bottom-10 left-6">
                      <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-lg">
                        {company.logoUrl ? (
                            <div
                                className="w-full h-full object-cover rounded-lg"
                            >
                              <AdvancedImage cldImg={getCloudinaryImage(company?.logoUrl)}/>
                            </div>
                        ) : (
                          <div className="w-full h-full rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-indigo-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-12">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      {company.verified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Star className="h-3 w-3 mr-1" />
                          Vérifié
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {company.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{company.industry || 'Secteur non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{company.size} employés</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Site web
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                      <Link
                        to={`/companies/${company.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {company.jobsCount} offres
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={observerTarget} className="mt-8 flex justify-center">
              {loadingMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              )}
            </div>

            {!hasMore && filteredCompanies.length > 0 && (
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