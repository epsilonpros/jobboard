import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  User as UserIcon,
  Phone,
  Briefcase,
  ExternalLink,
  X,
  Calendar
} from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';
import type { Company, User } from '../../types';
import {getCloudinaryImage} from "../../lib/utils.ts";

interface CompanyWithOwner extends Company {
  user?: User;
}

export default function AdminCompanies() {
  const [companies, setCompanies] = React.useState<CompanyWithOwner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [verificationFilter, setVerificationFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<CompanyWithOwner | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  const api = new ApiGeneric();

  React.useEffect(() => {
    fetchCompanies(1);
    setPage(1);
  }, [verificationFilter]);

  const fetchCompanies = async (pageNumber: number, isLoadMore = false) => {
    try {
      api.page = pageNumber;
      api.rowsPerPage = 12;

      const data = await api.getPaginate('/api/companies', 'page');

      // Fetch user details for each company
      const companiesWithOwners = data.member;

      if (isLoadMore) {
        setCompanies(prev => [...prev, ...companiesWithOwners]);
      } else {
        setCompanies(companiesWithOwners);
      }

      setHasMore(data.member.length === 12);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

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

  const handleVerifyCompany = async (companyId: string, verified: boolean) => {
    try {
      await api.onSend(`/api/companies/${companyId}`, {
        method: 'PATCH',
        data: { verified },
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });

      toast.success(verified ? 'Entreprise vérifiée' : 'Vérification retirée');
      fetchCompanies(1);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleFeatured = async (companyId: string, featured: boolean) => {
    try {
      await api.onSend(`/api/companies/${companyId}`, {
        method: 'PATCH',
        data: { featured },
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });

      toast.success(featured ? 'Entreprise mise en avant' : 'Entreprise retirée des mises en avant');
      fetchCompanies(1);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleViewDetails = (company: CompanyWithOwner) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerification = verificationFilter === 'all' ||
        (verificationFilter === 'verified' && company.verified) ||
        (verificationFilter === 'unverified' && !company.verified);
    return matchesSearch && matchesVerification;
  });

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des entreprises</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
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
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Toutes les entreprises</option>
                  <option value="verified">Entreprises vérifiées</option>
                  <option value="unverified">Entreprises non vérifiées</option>
                </select>
              </div>
          )}
        </div>

        {/* Companies List */}
        {loading && page === 1 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        ) : filteredCompanies?.length === 0 ? (
            <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
        ) : (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredCompanies?.map((company) => (
                      <li key={company.id}>
                        <div className="px-4 py-4 flex items-center sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                {company.logoUrl ? (
                                    <div
                                        className="h-10 w-10 rounded object-cover"
                                    >
                                      <AdvancedImage cldImg={getCloudinaryImage(company?.logoUrl)}/>
                                    </div>
                                ) : (
                                    <Building2 className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                                  {company.verified && (
                                      <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                                  )}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                                  <p>{company.location || 'Emplacement non spécifié'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                              <div className="flex space-x-4">
                                <button
                                    onClick={() => handleViewDetails(company)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Détails
                                </button>
                                <button
                                    onClick={() => handleVerifyCompany(company.id, !company.verified)}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                                        company.verified
                                            ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                  {company.verified ? 'Vérifiée' : 'Vérifier'}
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(company.id, !company.featured)}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                                        company.featured
                                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                  <Star className={`h-5 w-5 ${company.featured ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>

              {/* Loading indicator for infinite scroll */}
              <div ref={observerTarget} className="mt-8 flex justify-center">
                {loadingMore && (
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                )}
              </div>

              {/* End of list message */}
              {!hasMore && filteredCompanies.length > 0 && (
                  <div className="mt-8 text-center text-gray-500">
                    Vous avez atteint la fin de la liste
                  </div>
              )}
            </>
        )}

        {/* Company Details Modal */}
        {showModal && selectedCompany && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Détails de l'entreprise</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Company Info */}
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        {selectedCompany.logoUrl ? (
                            <div
                                className="h-14 w-14 rounded object-cover"
                            >
                              <AdvancedImage cldImg={getCloudinaryImage(selectedCompany?.logoUrl)}/>
                            </div>
                        ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h3>
                          {selectedCompany.verified && (
                              <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{selectedCompany.industry || 'Secteur non spécifié'}</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Contact</h4>
                      <div className="space-y-3">
                        {selectedCompany.user && (
                            <>
                              <div className="flex items-center text-sm text-gray-600">
                                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                                <span>Créé par: {selectedCompany.user.email}</span>
                              </div>
                              {selectedCompany.user.phone && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                                    <span>{selectedCompany.user.phone}</span>
                                  </div>
                              )}
                            </>
                        )}
                        {selectedCompany.website && (
                            <a
                                href={selectedCompany.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              <Globe className="h-5 w-5 mr-2" />
                              {selectedCompany.website}
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                        )}
                      </div>
                    </div>

                    {/* Company Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Informations détaillées</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{selectedCompany.location || 'Emplacement non spécifié'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{selectedCompany.size || 'Taille non spécifiée'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{selectedCompany.industry || 'Secteur non spécifié'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                          <span>Créé le {new Date(selectedCompany.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedCompany.description && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Description</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {selectedCompany.description}
                          </p>
                        </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                  <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Fermer
                    </button>
                    <button
                        onClick={() => handleVerifyCompany(selectedCompany.id, !selectedCompany.verified)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                            selectedCompany.verified
                                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      {selectedCompany.verified ? 'Retirer la vérification' : 'Vérifier l\'entreprise'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}