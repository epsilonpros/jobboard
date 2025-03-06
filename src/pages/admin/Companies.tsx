import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Star, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';
import type { Company } from '../../types';

export default function AdminCompanies() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [verificationFilter, setVerificationFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const api = new ApiGeneric();

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await api.onSend('/api/companies');
      setCompanies(data.member);

    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
    }
  };

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
      fetchCompanies();
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
      fetchCompanies();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
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
      {loading ? (
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCompanies?.map((company) => (
              <li key={company.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-10 w-10 rounded object-cover"
                          />
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
      )}
    </div>
  );
}